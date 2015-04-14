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
	
//	_messages : Ember.computed(function(key,value) {
//		if(value) {
//			for(var name in value) {
//				if(this._controlsByPath[name]!==undefined) {
//					this._controlsByPath[name].setMessages(value[name]);
//				}
//			}
//			return value;
//		}
//	}),
//
//	_validations : Ember.computed(function(key,value) {
//		if(value) {
//			for(var name in value) {
//				if(this._controlsByPath[name]!==undefined) {
//					this._controlsByPath[name].setValid(value[name]);
//				}
//			}
//			return value;
//		}
//	}),
	
	_setValidations : function(result,silent) {
		var validations=result.get('validations');
		var messages=result.get('messages');
		for(var name in validations) {
			if(this._controlsByPath[name]!==undefined) {
				this._controlsByPath[name].setValid(validations[name]);
				if(!silent && messages[name]!==undefined) {
					this._controlsByPath[name].setMessages(messages[name]);
				} else {
					this._controlsByPath[name].setMessages(null);
				}
			}
		}
	},
	
	_name: Ember.computed.oneWay('_modelName'),
	
	_controlsByPath: null,
	
	actions : {
		validate : function(path) {
			var form=this._form || this;
			var target=this.get('for');			
			var modelName=this.get('_modelName');
			var validator=this.get('_validator');
			if(!validator)
				return;
			if(path) {
				target=target.get(path);
				validator=validator.get(path);
				modelName=modelName+'.'+path;
			}
			
			validator.validate(target,modelName).then(function(result){
				form._setValidations(result);
			});

		},
		
		_submit: function(action) {
			this.sendAction('willSubmit',this);
			if(this.get('_observer')) {
				var form=this;
				this.get('_observer').run(function(result) {
					form._setValidations(result);
					if(result.isValid()) {
						form.__submit();
						form.send(action,form);				
						form.sendAction('didSubmit');
					}
				},false);
			}	
			else {
				this.__submit();
				this.send(action,this);				
				this.sendAction('didSubmit');	
			}
			
		}
	},
	
	_registerControl: function(control) {
		var name=this._modelName;
		if(control._path)
			name+='.'+control._path;
		this._controlsByPath[name]=control;
	},
	
	_unregisterControl: function(control) {
		var name=this._modelName;
		if(control._path)
			name+='.'+control._path;
		delete this._controlsByPath[name];
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
		this._super();
		var targetObject=this._syncToSource ? this['for'] : this.get('_proxy');
		var validator=this.get('_validator');
		// Initialize validaton if a validator was resolved and we're the root form, or the root form validator has no validation for our path
		if(validator && (!this._form || !this._form.get("_validator."+this._path))) {
			var form=this._form || this;
			
			this._observer = validator.observe(this,'for',function(result,sender,key) {
				// Code for settings validations and messages is triggering too many observer event atm.
				var silent=sender===null || sender===form
				form._setValidations(result,silent);
			},this.get('_path') || this.get('_modelName'));
			
			this._observer.run();
		
		}
	},
	
	willSubmit : null,
	
	didSubmit : null,
	
	__submit : function() {
		this._apply();
	},

	layoutName: function() {
		if(!this.get('container')) {
			return null;
		}
		var name='forms/'+getName(this.get('targetObject'),true);
		if(name!==null)
			name=name.replace(/\./g,'/');
		if(!this.get('container').lookup('template:'+name)) {
			if(getName(this.get('for'),true)) {
				name='forms/'+getName(this.get('for')).replace(/\./g,'/');
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
});