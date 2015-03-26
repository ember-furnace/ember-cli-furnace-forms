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
	
	_messages : Ember.A(),

	_validations : Ember.A(),
	
	_name: Ember.computed.alias('_modelName'),
	
	controlMessages: function() {
		if(!this.get('_messages')) {
			return Ember.A();
		}
		return this.get('_messages').filterBy('name',this._modelName);		
	}.property('_messages'),
	
	actions : {
		submit: function(action) {			
			this.sendAction('willSubmit',this);
			if(this.get('_observer')) {
				var form=this;
				this.get('_observer').run(function(result) {
					if(result.isValid()) {
						form._submit();
						form.send(action,form);				
						form.sendAction('didSubmit');
					}
				});
			}	
			else {
				this._submit();
				this.send(action,this);				
				this.sendAction('didSubmit');	
			}
			
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
	
	_validator: function() {
		var validator=this.get('validator');
		if(typeof validator==='object') {
			return validator;
		}
		else {
			var fn=this.container.lookup('validator:lookup');
			if(fn) {
				return fn.call(this,validator);
			}
			return null;
		}
	}.property('validator'),
	
	init : function() {
		this._super();
		var targetObject=this._syncToSource ? this['for'] : this.get('_proxy');
		
		var validator=this.get('_validator');
		
		// Initialize validaton if a validator was resolved and we're the root form, or the root form validator has no validation for our path
		if(validator && (!this._form || !this._form.get("_validator."+this._path))) {
			var form=this;
			
			
			this._observer = validator.observe(this,'for',function(result) {
				// Code for settings validations and messages is triggering too many observer event atm.
				form.set('_validations',result.getValidations());				
				form.set('_messages', result.getMessages());
			},this.get('_path') || this.get('_modelName'));

			// We do an initial validator run to prime the validation state (some fields may be initially valid)
			this._observer.run(function(result) {
				form.set('_validations',result.getValidations());
				// However, we do not want to bug users with immediate errors. A reset will discard all generated messages.
				result.reset();
			},false);
			
			this.addObserver('for',this,function() {
				// If our target changes, reset result messages, this will probably fail when async validations finish later
				// Judging on the code above, we might want to be able to set different root and children validation callback,
				// or the observer should not trigger validation at all when the root object changes, but should be destructed
				// and we might want to create a new observer... 
				// Probably this should also be configureable
				var result=this._observer.getResult();
				result.reset();
				this.set('_messages', result.getMessages());
			});
		}
	},
	
	willSubmit : null,
	
	didSubmit : null,
	
	_submit : function() {
		this._apply();
	},

	layoutName: function() {
		if(!this.get('container')) {
			return null;
		}
		var name='forms/'+getName(this.get('targetObject'),true).replace(/\./g,'/');
		if(!this.get('container').lookup('template:'+name)) {
			if(getName(this.get('for'),true)) {
				name='forms/'+getName(this.get('for')).replace(/\./g,'/');
			}
			if(!name || !this.get('container').lookup('template:'+name)) {
				name='form';
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