/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Ember from 'ember';
import Lookup from 'furnace-forms/utils/lookup-class';
import I18n from 'furnace-i18n';
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
	
	_component: null,
	
	_for : null,
	
	
	caption: I18n.computed(null),
	
	hasPrerequisites: null,
	
	_messagesSilent: false,
	
	actions: {
		
		reset : function(action) {
			this._reset();
		},
	},
	
	isEnabled: true,
	
	_enabled: true,
	
	setEnabled: function(enabled) {		
		if(enabled!=this._enabled) {
			this.set('_enabled',enabled);
		}
		this.setFlag('isEnabled',this._enabled && (!this._panel || this._panel.isEnabled));
	},
	
	_panelEnabledObserver:Ember.observer('_panel.isEnabled',function() {
		this.setEnabled(this._enabled);
	}),
	
	
	_valid: null,
	
	isValid: null,
	
	setValid: function(valid) {
		Ember.run.once(this,function() {
			if(valid!==this._valid) {	
				this.setFlag('isValid',valid);
				this.set('_valid',valid);
				this.notifyChange();
			}
		});
	},
		
	store: Ember.computed.alias('target.store'),
		
	_dirty: false,
	
	isDirty: false,
	
	setDirty: function(dirty) {
		Ember.run.once(this,function() {
			if(dirty!==this._dirty) {
				this.setFlag('isDirty',dirty);
				this.set('_dirty',dirty);						
				this.notifyChange();
			}
		});
	},
	
	setFlag:function(property,value) {
		this.set(property,value);
		this._components.invoke('set',property,value);
	},
	
	init:function() {		
		this._super();	
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
		if(this.caption instanceof Ember.ComputedProperty && this.get('caption')===null) {
			var name=this.get('_panel._modelName') ? this.get('_panel._modelName')+'.'+this.get('_name') : this.get('_name');			
			this.set('caption',name);
		}
		this._registerControl ? this._registerControl(this) : this._form._registerControl(this);
	},
	
	_apply: function() {

	},
	
	_reset: function() {
		this.setFlag('isValid',null);
		this.set('_valid',null);
	},
	
	notifyChange: function() {
		if(this._panel) {
			Ember.run.once(this,function() {
				this._panel.propertyDidChange(this._name);
			});
		}
	},
	
	_getPath: function() {
		if(!this['for']) {
			return (this.get('_panel._path') ? this.get('_panel._path')+ "." : '')+this.get('_name');
		}
	},
	
	getFor : function(path) {
		var model=null;
		if(this['for'])
			model = this.get('for');			
		else
			model = this.getForm().get('for');
		Ember.assert('Control '+this.toString()+' is trying to access the (form)model but it is not defined!',model);
		if(path) {
			return model.get(path);
		}
		return model;
	},
	
	getTarget : function() {
		if(this._form)
			return this.getForm().get('targetObject');
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
		this._messagesSilent=silent;
		if(this.get('hasPrerequisites')===false)
			silent=true;
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
					})
				}
			}
		});
		target.removeObjects(remove);
		if(source) {
			source.forEach(function(message) {
				target.pushObject(message)
			});
		}
	},
	
	_components : null,
	
	registerComponent:function(component) {
		this._components.pushObject(component);
		component.set('isValid',this.get('isValid'));
		component.set('isEnabled',this.get('isEnabled'));
		component.set('isDirty',this.get('isDirty'));
		if(!this._messagesSilent) {
			component._controlMessageObserver();
		}
	},
	
	unregisterComponent:function(component) {
		this._components.removeObject(component);
	},
	
	
	
	_componentType : 'forms',
	
	getComponentClass : function() {	
		var component=this._component
		if(typeof component ==="string") {
			component = Lookup.call(this,this._component,this._componentType);
		}
		return component;		
	},
	
	getComponent : function() {
		var component=this.getComponentClass();
		if(!component)
			return null;
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
		this._unregisterControl ? this._unregisterControl(this) : this._form._unregisterControl(this);
		this._super();
//		console.log('Destroy control ',this.toString());
	},
	
	destroy: function() {
		this._super();
//		console.log('destroying control',this.toString(),this._name);
//		Ember.warn('Destroying control '+this.toString()+ ' while there are still components attached! '+ (this._components.length),this._components.length===0);
//		if(this._components.length!==0)
//			console.trace();
	},
	
	
});