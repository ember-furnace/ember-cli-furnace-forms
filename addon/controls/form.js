/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Panel from './panel';
import Proxy from 'furnace-forms/proxy';
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
	
	_component: 'form',
	
	_componentType: 'forms',

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
		for(var name in validations) {
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
	},
	
	_name: Ember.computed.oneWay('_modelName'),
	
	_modelPath : Ember.computed('_form,_name',function() {
		if(!this._form) {
			return this.get('_name');
		} else { 
			return this._panel.get('_path');
		}
		return '';
	}),
	
	
	_controlsByPath: null,
	
	_forms: null,
	
	actions : {
		validate : function(paths) {
			
			this._validate(paths);

		},
		
		reset : function(action) {
			this._reset();
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
		
		Ember.warn(this+" cannot unregister control "+control+" with name "+name,this._controlsByPath[name]!==undefined);
		if(this._controlsByPath[name]!==undefined) {
			this._controlsByPath[name].removeObject(control);
		} else {
			console.log(this._controlsByPath);
		}
		if(this._form) {
			if(control===this) { 
				this._form._unregisterForm(control);
			} else {
				this._form._unregisterControl(control, this._panel._path|| this._name);
			}
		}
	},
	
	_proxy : function() {
		var properties={};
		this.get('inputControls').forEach(function(control) {
			properties[control._name]=Ember.computed(function() {
				return control.get('value');
			}).volatile();
		});
		return Ember.ObjectProxy.extend(properties).create({content: this['for']});
	}.property('for'),
	
	validator : function() {
		// Always return our validator name, regardless of parent form validators
//		if(this._form && this._form.get("_validator."+this._path)) {
//			return this._form.get("_validator."+this._path);
//		}		
		return this.constructor.typeKey;
	}.property('for'),
	
	validationDetached : Ember.computed('isEnabled,_validationDetached',function() {
		return !this.get('isEnabled') || this.get('_validationDetached');
	}),
	
	_validationDetached:false,
	
	_validate : function(paths) {
		var form=this;
		var target=this.get('for');			
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
					target=input.get('_form.for');
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
			promisses.pushObject(validator.validate(target,modelName));
			promisses.pushObjects(this._forms.filterBy('validationDetached',false).invoke('_validate'));
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
	
	'for' : null,
	
	init : function() {
		this._forms=Ember.A();
		this._controlsByPath={};
		this._validationCache={};
		this._messageCache={};
		
		if(!this._syncFromSource || !this._syncToSource) {
			var _for=this.get('for') ;
			this.reopen({
				'for' : Ember.computed(function(key,value) {
							if(value) {
								if(!this._syncFromSource || !this._syncToSource) {
									return Proxy.create({_content:value,
										_syncFromSource: this._syncFromSource,
										_syncToSource: this._syncToSource});
								}
								return value;						
							}
							return null;
						}),
			});
			this.set('for',_for);
		} 
		
		this._super();
		this.set('_path',null);		
		
//		var targetObject=this._syncToSource ? this['for'] : this.get('_proxy');
		Ember.run.scheduleOnce('afterRender',this,function() {
			var validator=this.get('_validator');
			// Initialize validaton if a validator was resolved and we're the root form, or the root form validator has no validation for our path
			if(validator && (!this._form || !(this._form.get("_validator."+this._path) instanceof validator.constructor))) {
				var form= this;
				this._observer = validator.observe(this,'for',function(result,sender,key) {
					var silent=sender===null || sender===form;
					// If our target model changed, immediate show validations unless it's a new model
					if(silent && ((form.get('for.isDirty')===true || (form.get('for.isDirty')===undefined && form.get('isDirty'))) && !form.get('for.isNew'))) {
						silent=false;
					}
//					
//					Ember.debug(form);
//					console.log('Ran validation',sender ? sender.toString() : null,key,silent);
//					console.log(result.get('validations'));
//					console.log(result.get('messages'));
//					Ember.debug(sender);
//					console.log('--------------');
					
					form._setValidations(result,silent);
					
					// We only want to receive changed status on next run, so reset the result if it has finished
					if(result.hasFinished()) {
						result.reset();
					}
				}, this.get('_modelName'));
				
			
				if(this.get('for')) {
					this._currentFor=this.get('for');
					this._observer.run();
				}
			}
		});
	},
	
	_currentFor : undefined,
	
	_forObserver : Ember.observer('for',function(){
		// Only reset if 'for' actually changed
		if(this.get('for')!==this._currentFor) {
			this._reset(true);
			this._currentFor=this.get('for');
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
	
//	unregisterComponent:function(component) {
//		this._super(component);
//		if(this._components.length===0) {
//			Ember.run.later(this,function(){
//				this.destroy();
//			});
//		}
//	},
	
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
	
//	getComponentClass : function(context,contextName) {
//		var component=this._component
//		if(typeof component ==="string") {
//			component = Lookup.call(context,this._component,'form');
//		}
//		if(this._extend) {
//			var typeKey=component.typeKey;
//			component= component.extend(this._extend);
//			component.typeKey=typeKey;
//		}		
//
//		return component;
//		
//	},
	
}).reopenClass({
	async : function() {
		this.reopen({
			_syncFromSource : false,
			
			_syncToSource : false,
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
				}
				break;
		}
		return this;
		
	},
});
export default Form;