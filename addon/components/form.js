/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Ember from 'ember';
import Panel from './panel';
import getName from 'furnace-forms/utils/get-name';

/**
 * Form component
 * 
 * @class Form
 * @namespace Furnace.Forms.Components
 * @extends Furnace.Forms.Components.Panel
 */
export default Panel.extend({
	tagName: 'form',
	
	classNameBindings: ['_name','_modelName'],
	
	_syncFromSource : true,
	
	_syncToSource : true,
	
	_observer : null,
	
	_validationCache : null,
	
	_messageCache : null,
	
	_setValidations : function(result,silent) {
		var validations=result.get('validations');
		var messages=result.get('messages');
		this._validationCache=validations;
		this._messageCache=messages;				
		for(var name in validations) {
			if(this._controlsByPath[name]!==undefined) {				
				this._controlsByPath[name].setValid(validations[name]);
				if(messages[name]!==undefined) {
					this._controlsByPath[name].setMessages(messages[name],silent);
				}
				else { 
					this._controlsByPath[name].setMessages(null);
				}
			}
		}
	},
	
	_name: Ember.computed.oneWay('_modelName'),
	
	_controlsByPath: null,
	
	actions : {
		validate : function(paths) {
			var form=this;
			var target=this.get('for');			
			var modelName=this.get('_modelName');
			var validator=this.get('_validator');
			var promisses=Ember.A();
			if(!validator)
				return;
			if(paths) {				
				if(typeof paths==='string'){
					paths=Ember.A(paths);
				}
				paths.forEach(function(path) {
					path=path.replace(/^_form\./,'');
					path=form.get(path+'._path');
					target=target.get(path);
					validator=validator.get(path);
					modelName=modelName+'.'+path;
					promisses.pushObject(validator.validate(target,modelName))
				})
			}
			else {
				promisses.pushObject(validator.validate(target,modelName));
			}
			Ember.RSVP.all(promisses).then(function(result){
				result.forEach(function(result) {
					form._setValidations(result);
					if(result.hasFinished())
						result.reset();
				});
				
			});

		},
		
		reset : function(action) {
			this._reset();
			if(this._observer)
				this._observer.run();
			if(action)
				this.send(action,form);
		},
		
		_submit: function(action) {
			this.sendAction('willSubmit',this);
			action=action || 'submit';
			if(this.get('_observer')) {
				var form=this;
				this.get('_observer').run(function(result) {
					form._setValidations(result);
					if(result.hasFinished()) {
						result.reset();
					}
					else {
						Ember.warn('There are still validations being performed in submit callback, submit cancelled!');
						return;
					} 
					if(result.isValid()) {
						form._submit();						
						form.send(action,form);				
						form.sendAction('didSubmit');
					}
				},false);
			}	
			else {
				this._submit();
				this.send(action,this);				
				this.sendAction('didSubmit');	
			}
			
		}
	},
	
	_registerControl: function(control,prefix) {
		var name=(prefix ? prefix : this._modelName);
		// We should register ourself nameless. If there is a parent it should register with our name.
		if(control!==this && control._path)
			name+='.'+control._path;		
		this._controlsByPath[name]=control;
		
		if(this._validationCache[name]!==undefined)
			control.setValid(this._validationCache[name]);
		if(this._messageCache[name]!==undefined) 
			control.setMessages(this._messageCache[name],true);
		
		if(this._form && control!==this) {
			this._form._registerControl(control,this._modelName);
		}
	},
	
	_unregisterControl: function(control,prefix) {
		var name=(prefix ? prefix : this._modelName);
		if(control!==this && control._getPath())
			name+='.'+control._getPath();
		delete this._controlsByPath[name];
		
		if(this._form && control!==this) {
			this._form._unregisterControl(control,this._modelName);
		}
	},
	
	_proxy : function() {
		var properties={}
		this.get('inputControls').forEach(function(control) {
			properties[control._name]=Ember.computed(function(key) {
				return control.get('value');
			});
		});
		return Ember.ObjectProxy.extend(properties).create({content: this['for']});
	}.property('for'),
	
	validator : function() {
		if(this._form && this._form.get("_validator."+this._path)) {
			return this._form.get("_validator."+this._path);
		}		
		return this.constructor.typeKey;
	}.property('for'),
	
	_reset:function(modelChanged) {
		this._validationCache={};
		this._messageCache={};
		this._super(modelChanged);
	},
	
	_validator: function() {
		var validator=this.get('validator');
		if(typeof validator==='object') {
			return validator;
		}
		else {
			var fn=this.container.lookup('validator:lookup');
			if(fn) {
				try {
					return fn.call(this,validator);
				}
				catch(e) {				
					Ember.warn('A form tried to resolve a validator for "'+validator+'" but got the following error: '+e.message);
					return null;
				}
			}
			return null;
		}
	}.property('validator'),
	
	init : function() {
		this._controlsByPath={};
		this._validationCache={};
		this._messageCache={};
		this._super();
		var targetObject=this._syncToSource ? this['for'] : this.get('_proxy');
		var validator=this.get('_validator');
		// Initialize validaton if a validator was resolved and we're the root form, or the root form validator has no validation for our path
		if(validator && (!this._form || !this._form.get("_validator."+this._path))) {
			var form= this;
			this._observer = validator.observe(this,'for',function(result,sender,key) {
				var silent=sender===null || sender===form
				if(silent && form.get('for.isDirty'))
					silent=false;
//				Ember.debug(form);
//				console.log('Ran validation',sender,key);
//				console.log(result.get('validations'));
//				console.log(result.get('messages'));
//				Ember.debug(sender);
//				console.log('--------------');
				
				form._setValidations(result,silent);
				if(result.hasFinished())
					result.reset();
			},this.get('_path') || this.get('_modelName'));
			
			this._observer.run();
		
		}
	},
	
	_forObserver : Ember.observer('for',function(){
		this._reset(true);
	}),
	
	willSubmit : null,
	
	didSubmit : null,
	
	_submit : function() {
		this._apply();
	},

	submit : function() {
		this.send('_submit');
	},
	
	layoutName: function() {
		if(!this.get('container')) {
			return null;
		}
		var name=getName(this.get('targetObject'),true)+'/form';
		if(name!==null)
			name=name.replace(/\./g,'/');
		if(!this.get('container').lookup('template:'+name)) {
			if(getName(this.get('for'),true)) {
				name=getName(this.get('for')).replace(/\./g,'/')+'/form';
			}
			if(!name || !this.get('container').lookup('template:'+name)) {
				name='forms/form';
			}
		}
		return name ;
	}.property('targetObject','for'),
	
	destroy: function() {
		if(this._observer) {
			this._observer.destroy();
		}
		this._super();
	}
}).reopenClass({
	async : function() {
		this.reopen({
			_syncFromSource : false,
			
			_syncToSource : false,
		});
		return this;
	}
});