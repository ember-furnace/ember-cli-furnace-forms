/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Panel from './panel';
import Proxy from 'furnace-forms/proxy';
import Conditional from 'furnace-forms/mixins/controls/conditional';
import { defaultCondition } from 'furnace-forms/utils/conditions';
import lookupProxy from 'furnace-forms/utils/lookup-proxy';
import Ember from 'ember';
/**
 * Form control component proxy 
 * 
 * @class Form
 * @namespace Furnace.Forms.Controls
 * @extends Furnace.Forms.Controls.Abstract
 * @protected
 */
var Form = Panel.extend({
	_isForm : true,
	
	_decoratorName: 'form',
	
	_decoratorType: 'form',

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
		var setControlMessages=function(control){
			control.setMessages(messages[name].toArray(),silent);
		};
		var keys=Object.keys(validations).sort().reverse();
		// Set invalid controls first, to prevent premature parent isValid trigger
		var i,name;
		for(i=0;i<keys.length;i++ ) {
			name=keys[i];
			if(validations[name]===false) {
				if(this._controlsByPath[name]!==undefined) {				
					this._controlsByPath[name].invoke('setValid',validations[name]);
					if(messages[name]!==undefined) {
						this._controlsByPath[name].forEach(setControlMessages);
					}
					else { 
						this._controlsByPath[name].invoke('setMessages',null);
					}
				}
			}
		}
		// Then, set controls that became valid
		for(i=0;i<keys.length;i++ ) {
			name=keys[i];
			if(validations[name]===true) {
				if(this._controlsByPath[name]!==undefined) {				
					this._controlsByPath[name].invoke('setValid',validations[name]);
					if(messages[name]!==undefined) {
						this._controlsByPath[name].forEach(setControlMessages);
					}
					else { 
						this._controlsByPath[name].invoke('setMessages',null);
					}
				}
			}
		}
	},
	
	_name: Ember.computed.oneWay('_modelName'),
	
	_modelPath : Ember.computed('_form,_name',{
		get : function() {
			if(!this._form) {
				return this.get('_name');
			} else { 
				return this._panel.get('_path');
			}
		}
	}).readOnly(),
	
	
	_controlsByPath: null,
	
	_forms: null,
	
	_rootControl : false,
	
	actions : {
		validate : function(paths) {
			
			this._validate(paths);

		},
		
		reset : function() {
			var hard=false;
			var action=null;
			if(arguments.length===1) {
				if(typeof arguments[0]==='boolean') {
					hard=arguments[0];
				} else {
					action=arguments[0];
				}
			} else if(arguments.length>1) {
				action=arguments[0];
				hard=arguments[1];
			}
			this._reset(hard);
			if(this._observer) {
				this._observer.run();
			}
			if(action) {
				this.send(action,this);
			}
		},
		
		submit: function(action) {
			action= action===undefined  ?  'submit' : action;
			var form=this;
			this._validate().then(function(valid) {
				if(valid) {
					form._submit();	
					form.get('target').send(action,form);				
				} else {
					// Notice about invalid for development?
					Ember.Logger.info(form+' was submitted but was marked invalid');
				}
				
			});
			
		}
	},
	
	_registerForm: function(form) {
		this._forms.pushObject(form);
		if(this._form) {
			this._form._registerForm(form);
		}
	},
	
	_unregisterForm: function(form) {
		this._forms.removeObject(form);
		if(this._form) {
			this._form._unregisterForm(form);
		}
	},
	
	_registerControl: function(control,prefix) {
		var name= this.get('_modelName');
		if(prefix) {
			name+='.'+prefix;
		}
		// We should register ourself nameless. If there is a parent it should register with our name.
		if(control!==this) {
			// If a control has path, register it with that path
			if(control._path) {
				name+='.'+control._path;
			}
			// If not, the control is a root for a model, i think we should register it by its name
			else {
				name+='.'+control.get('_name');
			}
		} else {
			if(!name) {
				name='form';
			}
		} 
			
		Ember.assert("Could not determine name for control "+control,name);
		if(this._controlsByPath[name]===undefined) {
			this._controlsByPath[name]=Ember.A();
		}
		
		this._controlsByPath[name].pushObject(control);
		
		if(this._validationCache[name]!==undefined) {
			control.setValid(this._validationCache[name]);
		}
		
		if(this._messageCache[name]!==undefined) { 
			control.setMessages(this._messageCache[name],true);
		}
		
		if(this._form) {
			if(control===this) { 
				this._form._registerForm(control);
			}
			else {
				this._form._registerControl(control, this._panel._path || this._name);
			}
		}
	},
	
	_unregisterControl: function(control,prefix) {
		var name= this.get('_modelName');
		if(prefix) {
			name+='.'+prefix;
		}
		
		if(control!==this) {
			if(control._path) {
				name+='.'+control._path;
			}
			// If not, the control is a root for a model, i think we should register it by its name
			else {
				name+='.'+control.get('_name');
			}
		}else {
			if(!name) {
				name='form';
			}
		} 
		
		Ember.warn(this+" cannot unregister control "+control+" with name "+name,this._controlsByPath[name]!==undefined,{id:'furnace-forms:control.form.unregister'});
		if(this._controlsByPath[name]!==undefined) {
			this._controlsByPath[name].removeObject(control);
		}
		
		if(this._form) {
			if(control===this) { 
				this._form._unregisterForm(control);
			} else {
				this._form._unregisterControl(control, this._panel._path|| this._name);
			}
		}
	},
	
	validator : Ember.computed('_model',{
		get  :function() {
			// 	Always return our validator name, regardless of parent form validators
			return this.constructor.typeKey;
		},
		set : function(key,value) {
			return value;
		}
	}),
	
	validationDetached : Ember.computed('isEnabled,_validationDetached',{
		get : function() {
			return !this.get('isEnabled') || this.get('_validationDetached');
		}
	}).readOnly(),
	
	_validationDetached:false,
	
	_validate : function(paths) {
		var form=this;
		var target=this.get('_model');			
		var modelName=this.get('_modelName');
		var validator=this.get('_validator');
		var promisses=Ember.A();
		if(this._panel && this._panel._isFormOption) {
			if(!this._panel.get('selected')) {
				return new Ember.RSVP.Promise(function(resolve) {
					resolve(true);
				});
			}
		}
		if(!validator) {
			return new Ember.RSVP.Promise(function(resolve) {
				resolve(true);
			});
		}
		if(paths) {				
			if(typeof paths==='string'){
				paths=Ember.A(paths);
			}
			paths.toArray().forEach(function(path) {
				var _path=path.replace(/^_form\./,'');
				var input=form.get(_path);
				if(input) {
					paths.removeObject(path);
					validator=input.get('_form._validator');
					target=input.get('_form._model');
					path=input.get('_path');
					if(path) {
						Ember.assert('No target for validation of path ' + path + " in form " +form,target);
//						target=target.get(path);
//						if(validator)
//							validator=validator.get(path);
//						if(validator) {
							path=modelName+'.'+path;
							promisses.pushObject(validator.validate(target,modelName,null,[path]));
//						}					
					}
					if(input instanceof Form) {
						promisses.pushObject(input._validate());
					}
				} else {
					Ember.warn('Tried to validate path "'+_path+'" but it does not exist in '+form);
				}
				
			});
			promisses.pushObjects(this._forms.invoke('_validate',paths));
		} else {
			promisses.pushObjects(this._forms.filterBy('validationDetached',false).invoke('_validate'));
			promisses.pushObject(validator.validate(target,modelName));
		}
		return Ember.RSVP.all(promisses).then(function(result){
			var outcome=true;
			result.forEach(function(result) {
				if(typeof result==='boolean') {
					if(!result) {
						outcome=false;
						return false;
					}
					return true;
				}
				if(!result.hasFinished()) {
					outcome=false;
					return false;
				} else {
					form._setValidations(result);
					result.reset();
					if(!result.isValid()) {
						outcome = false;
					}
				}
			});
			return outcome;
			
		});
	},
	
	_reset:function(modelChanged) {
		this._validationCache={};
		this._messageCache={};
		this._super(modelChanged);
		this._forms.invoke('_reset',modelChanged);
	},
	
	_validator: Ember.computed('validator', {
		get: function() {
			var validator=this.get('validator');
			if(typeof validator==='object') {
				return validator;
			}
			else {
				var fn=Ember.getOwner(this).lookup('validator:lookup');
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
		}
	}),
	
	'for' : null,
	
	_model : Ember.computed.alias('for'),
	
	init : function() {
		this._forms=Ember.A();
		this._controlsByPath={};
		this._validationCache={};
		this._messageCache={};
		
		if(!this._syncFromSource || !this._syncToSource) {
			this._asyncObserver();
		} 
		if(typeof this['for']==='function') {			
			this.set('_model',this['for'].apply(this));
		}
		this._super();
		
		this.set('_path',null);		
		
//		var targetObject=this._syncToSource ? this['for'] : this.get('_proxy');
		Ember.run.scheduleOnce('afterRender',this,this._setupValidator);
	},
	
	_setupValidator : function() {
		var validator=this.get('_validator');
		// Initialize validaton if a validator was resolved and we're the root form, or the root form validator has no validation for our path
		if(validator && (!this._form || !(this._form.get("_validator."+this._path) instanceof validator.constructor))) {
			var form= this;
			this._observer = validator.observe(this,'_model',function(result,sender) {
				var silent=sender===null || sender===form;
				// If our target model changed, immediate show validations unless it's a new model
				if(silent && ((form.get('_model.hasDirtyAttributes')===true || (form.get('_model.hasDirtyAttributes')===undefined && form.get('isDirty'))) && !form.get('_model.isNew'))) {
					silent=false;
				}
//				
//				Ember.debug(form);
//				console.log('Ran validation',sender ? sender.toString() : null,key,silent);
//				console.log(result.get('validations'));
//				console.log(result.get('messages'));
//				Ember.debug(sender);
//				console.log('--------------');
				
				form._setValidations(result,silent);
				
				// We only want to receive changed status on next run, so reset the result if it has finished
				if(result.hasFinished()) {
					result.reset();
				}
			}, this.get('_modelName'));
			
		
			if(this.get('_model')) {
				this._currentModel=this.get('_model');
				this._observer.run();
			}
		}
	},
	
	_currentModel : undefined,
	
	_modelObserver : Ember.observer('_model',function(){
		// Only reset if 'for' actually changed
		if(this.get('_model')!==this._currentModel) {		
			this._reset(true);
			this._currentModel=this.get('_model');
		}
	}),
	
	willSubmit : null,
	
	didSubmit : null,
	
	_submit : function() {
		this._apply();
	},
	
	
	submit : function(action) {
		this.send('submit',action);
	},
	
	destroy: function() {
		if(this._observer) {
			this._observer.destroy();
		}
		this._super();
	},
	
	getComponent : function() {
		var component=this.getComponentClass();
		return component.extend({_debugContainerKey : this._debugContainerKey});
	},
	
	
}).reopenClass({
	async : function(options) {
		this.reopen({
			_syncFromSource : options ? options.fromSource || false : false,
			
			_syncToSource : options ? options.toSource || false : false,
			
			_asyncObserver : Ember.observer('for',function() {
				if(this._syncFromSource && this._syncToSource) { 
					return;
				}
				var model=this.get('for');
				if(this.get('_model') instanceof Proxy) {
					this.get('_model').destroy();
				}
				if(model) {
					if(!this._syncFromSource || !this._syncToSource) {							
						model= lookupProxy.call(this,model,null,{
							fromSource: this._syncFromSource,
							toSource: this._syncToSource});
					}										
				}						
				this.set('_model',model);
			}),
			
			_model : null
		});
		return this;
	},
	model : function() {
		switch(arguments.length) {
			case 2:
				this.reopen({
					_modelName : arguments[0],
					'for' : arguments[1]
				});
				this.reopenClass({
					_modelSet:true
				});
				break;
			case 1:
				if(typeof arguments[0]==='string') {
					this.reopen({
						_modelName : arguments[0]
					});
				} else {
					this.reopen({
						'for' : arguments[0]
					});
					this.reopenClass({
						_modelSet:true
					});
				}
				break;
		}
		return this;
		
	},
	on : function(props,fn) {
		props=props.split(',');
		var _conditionFn;
		if(arguments.length===1) {
			_conditionFn=defaultCondition;
		}
		else {
			_conditionFn=function customCondition() {	
				this.get('conditionProperties').forEach(function(property) {
					this.get(property);
				},this);
				if(!this.hasModel()) {
					return false;
				}
				return fn.call(this);
			};
		}
		return this.extend(Conditional,{
			_conditionProps: props.join(','),
			_conditionFn: _conditionFn
		});
	},
});
export default Form;