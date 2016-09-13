/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Ember from 'ember';
import Lookup from 'furnace-forms/utils/lookup-class';
import Proxy from 'furnace-forms/proxy';
import Actions from 'furnace-forms/mixins/controls/control-actions';
import Conditional from 'furnace-forms/mixins/controls/conditional';

import {
	defaultCondition,	
	getProps } from 'furnace-forms/utils/conditions';
/**
 * Abstract control component proxy 
 * 
 * @class Abstract
 * @namespace Furnace.Forms.Controls
 * @extends Ember.ObjectProxy
 * @private
 */
export default Ember.Object.extend(Ember.ActionHandler,{
	
	_name: null,
	
	_form: null,
	
	_panel: null,
	
	_decoratorName: null,
	
	_decoratorType: null,
	
	_decorator: Ember.computed('_decoratorName,_decoratorType', {
		get : function() {
			Ember.assert('furnace-forms: '+this+' ('+this._name+') does not specify a decorator type or name',this.get('_decoratorName') && this.get('_decoratorType'));
			return this.get('_decoratorName')+'.'+this.get('_decoratorType')+'-decorator';
		},
		set : function(key,value) {
			return value;
		}
	}),
	
	decorator : Ember.computed.alias('_decorator').readOnly(),
	
	_for : null,
	
	caption: undefined,
	
	hasPrerequisites: null,
	
	_messagesSilent: false,
	
	actions: {
	},
	
	isEnabled: true,
	
	_enabled: true,
	
	setEnabled: function(enabled) {		
		if(enabled!==this._enabled) {
			this.set('_enabled',enabled);
		}
		var isEnabled = this._enabled && (!this._panel || this._panel.get('isEnabled'));
				
		if(isEnabled!==this.get('isEnabled')) {
			if(isEnabled) {
				this.send('onEnabled');
			} else {
				this.send('onDisabled');
			}
			this.setFlag('isEnabled',isEnabled);
		}
	},
			
	_panelEnabledObserver:Ember.observer('_panel.isEnabled',function() {
		this.setEnabled(this._enabled);
	}),
	
	_valid: null,
	
	isValid: null,
	
	
	setValid: function(valid) {
		if(valid!==this._valid) {	
			this.setFlag('isValid',valid);
			if(valid) {
				this.send('onValid');
			} else {
				this.send('onInvalid');
			}
			this.set('_valid',valid);
			this.notifyChange();
		}
	},
	
	
		
	store: Ember.computed.alias('target.store'),
		
	_dirty: false,
	
	isDirty: false,
	
	setDirty: function(dirty) {
		this._didReset=false;
		if(dirty!==this._dirty) {
			this.setFlag('isDirty',dirty);
			this.set('_dirty',dirty);						
			this.notifyChange();
		}
	},
	
	_flags: null, 
	
	setFlag:function(property,value) {
		if(this.get(property)!==value) {
			this.set(property,value);			
			this._flags[property]=value;
			Ember.run.scheduleOnce('sync',this,this._updateFlags);
		}
	},
	
	_updateFlags: function() {
		for(var flag in this._flags) {
			this._components.invoke('set',flag,this._flags[flag]);			
			delete this._flags[flag];
		}
	},
	
	init:function() {	
		this._super();
		this._flags={};
		this.set('_controlMessages',Ember.A());
		this.set('_components',Ember.A());		
		var control=this;
		// Initialize computed attributes
		this.constructor.eachComputedProperty(function(name, meta) {			
			if (meta.type==='form-attr') {
				control.get(name);
			}
		});
		if(this._form) {
			this.set('_path',this._getPath());
			this.set('target',this._panel);
		}

		this._panelEnabledObserver();
		if(this._registerControl)  {
			this._registerControl(this);
		} else {
			this._form._registerControl(this);
		}
	},
	
	_apply: function() {

	},
	
	_didReset : false,
	
	_reset: function(modelChanged) {
// This breaks already set validation, our value might not change by a reset so may not trigger a new validation
		if(modelChanged) {
			this.setFlag('isValid',null);
			this.set('_valid',null);
		}
		this._didReset=true;		
	},
	
	notifyChange: function() {
		if(this._panel) {
			Ember.run.scheduleOnce('sync',this,this._notifyPanel);
		}
	},
	
	_notifyPanel: function(){
		if(this._panel) {
			this._panel.propertyDidChange(this._name);
		}
	},
	
	_getPath: function() {
		// Temporary work arround to give lists a proper path
		// Temporary work arround to make sure forms dont get an absolute path
		if(!this['_model'] || this._isList || (this.get('_model')!==this.get('_panel._model') && !this._isForm)) {
			return (this.get('_panel._path') ? this.get('_panel._path')+ "." : '')+this.get('_name');
		} else if(this._panel && this.get('_model')===this.get('_panel._model')) {
			return this.get('_panel._path');
		}	

	},
	
	hasModel : function() {
		var model=null;
		if(this['_model']) {
			model = this.get('_model');			
		} else {
			if(this.getForm()) {
				model = this.getForm().get('_model');
			}
		}
		if(!model) {
			return false;
		}
		return true;
	},
	
	getModel : function(path,real) {		
		var model=null;
		if(this['_model']) {
			model = this.get('_model');			
		} else {
			if(this.getForm()) {
				model = this.getForm().get('_model');
			}
		}
		if(!model) {		
			Ember.warn('Control '+this.toString()+' is trying to access the (form)model but it is not defined!',model,{id:'furnace-forms:control.model-missing'});
			return undefined;
		}
		if(arguments.length===1 && typeof arguments[0]==='boolean'){
			path=null;
			real=arguments[0];
		}			
		
		if(path) {
			model= model.get(path);
		}
		if(real && model instanceof Proxy) {
			return model._content;
		}
		return model;
	},
	
	getFor : function(path) {
		return this.getModel(path);
	},
	
	getTarget : function() {
		if(this._form) {
			return this.getForm().get('targetObject');
		}
		return this.get('targetObject');
	},
	
	getPanel : function() {
		return this._panel;
	},
	
	getForm : function(path) {
		if(path) {
			return this._form.get(path);
		}
		return this._form;
	},
	
	_controlMessages : null,
	
	setMessages: function(messages,silent) {
		this._updateMessages(messages,this._controlMessages);		
		if(this.get('hasPrerequisites')===false || this._components.length===0 || this._didReset) {
			silent=true;
		}
		this._didReset=false;
		this._messagesSilent=silent;		
//		console.log("New messages for "+this+" Components: "+this._components.length);
		if(!silent) {
			Ember.run.once(this,function() {
				this._components.invoke('_controlMessageObserver');
			});
		}
	},
	
	
	_updateMessages: function(source,target) {
		var remove=Ember.A();
		target.forEach(function(item) {
			if(!source) {
				remove.pushObject(item);
			} else {
				var _messages=source.filterBy('type',item.type).filterBy('message',item.message);
				if(!_messages.length) {
					remove.pushObject(item);
				} else {
					
					_messages.forEach(function(message) {
						Ember.set(item,'attributes',message.attributes);
						source.removeObject(message);
					});
				}
			}
		});
		target.removeObjects(remove);
		if(source) {
			source.forEach(function(message) {
				target.pushObject(message);
			});
		}
	},
	
	_components : null,
	
	registerComponent:function(component) {
		this._components.pushObject(component);
		component.set('isValid',this.get('isValid'));
		component.set('isEnabled',this.get('isEnabled'));
		component.set('isDirty',this.get('isDirty'));
		if(!this._messagesSilent && this._controlMessages.length) {
//			console.log(component+" component registered to "+this+", updating messages");			
			component._controlMessageObserver();
		}
		this.send('onComponent',component);
		
	},
	
	unregisterComponent:function(component) {
		this._components.removeObject(component);
	},
	
	
	getComponentClass : function() {	
		Ember.assert('getComponentClass is no longer support',false);
		var component=this._decorator;
		if(typeof component ==="string") {
			component = Lookup.call(this,this._decoratorName,this._decoratorType);
		}
		return component;		
	},
	
	getComponent : function() {
		var component=this.getComponentClass();
		if(!component) {
			return null;
		}
		return component.create({container:this.container,
								control:this,
								_debugContainerKey : component + this.get('_name')
								});
	},
	
	toString: function() {
		var string=this._super();
		return string.substring(0,string.length-1)+':'+this.get('_name')+'>';
	},
	
	willDestroy : function() {
	    if(!this.isDestroyed) {
		//this._unregisterControl ? this._unregisterControl(this) : this._form._unregisterControl(this);
	}
		this._super();
	},
	
	destroy: function() {
		this._super();
		if(this._unregisterControl) {
			this._unregisterControl(this);
		} else {
			this._form._unregisterControl(this);
		}
		this.set('target',null);
		this.set('_panel',null);
		this.set('_form',null);
//		Ember.warn('Destroying control '+this.toString()+ ' while there are still components attached! '+ (this._components.length),this._components.length===0);
//		if(this._components.length!==0)
//			console.trace();
	},
	
	
}).reopenClass({
	decorator : function(decorator) {
		return this.reopen({
			_decoratorName : decorator
		});
	},
	
	on : function(props,fn) {
		props=getProps(props);
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
				return fn.call(this._form);
			};
		}
		return this.extend(Conditional,{
			_conditionProps: props.join(','),
			_conditionFn: _conditionFn
		});
	},
}).extend(Actions);