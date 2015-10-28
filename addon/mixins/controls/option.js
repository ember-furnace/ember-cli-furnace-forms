/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Ember from 'ember';
import ControlSupport from 'furnace-forms/mixins/controls/control-support';
import getControl from 'furnace-forms/utils/get-control';
import I18n from 'furnace-i18n';
/**
 * Input control component proxy 
 * 
 * @class Input
 * @namespace Furnace.Forms.Controls
 * @extends Furnace.Forms.Controls.Abstract
 * @protected
 */
export default Ember.Mixin.create(ControlSupport,{
	_isFormOption: true,
	
	_componentType : 'input',
	
	_component: null,
	
	actions :{
		select : function() {
			Ember.run.later(this,function() {
				this._panel.select(this._option.index,!this.get('selected'));
			});
		}
	},
	
	_name : 'option',
	
	_option : null,
	
	value : null,
	
	_valueObserver:Ember.observer('value',function() {
		if(this.get('_option.value')!==this.value) {
			var selected=this.get('selected');
			if(selected)
				this._panel.select(this._option.index,false);
			this.set('_option.value',this.value);
			if(selected)
				this._panel.select(this._option.index,true);
		}
	}),
	
	selected :  Ember.computed.alias('_option.selected'),
	
	caption : Ember.computed.alias('_option.caption'),
	
	showOptionControl : Ember.computed('optionControl,selected',function() {
		this._controlValidObserver();
		var optionControl=this.get('optionControl');
		if(optionControl) {
			if(this.get('selected')) {
				optionControl.setEnabled(true);
				return true;
			}
			optionControl.setEnabled(false);
		} 
		return false;
	}),
	
	_optionControl : null,
	
	optionControl : Ember.computed('_option.control',function() {
		// @TODO: should probably destroy existing control
		if(this._optionControl === null && this._option.control) {
			var options=this._option.control._meta.options;
			options.caption=Ember.computed.alias('_panel.caption');
			this._optionControl= getControl.call(this,'value',options._controlType,options);
		}
		return this._optionControl;
	}).meta({type : 'form-control'}),
	
	
	setValid : function(valid) {
		Ember.run.once(this,function() {
			if(this.isDestroyed) {
				Ember.warn('Attempting to change validity of destroyed object '+this.toString());
				return;
			}
			if(this._valid!=valid) {				
				this.set('_valid',valid);
			}
			if(this.get('selected'))
				valid= valid!==false && this.get('controls').filterBy('isValid',false ).get('length')===0
			if(valid!=this.isValid) {
				this.setFlag('isValid',valid);
				this.notifyChange();
			}
		});
	},
	
	
	index : Ember.computed.alias('_option.index'),
	
	_input : null,
	
	init: function() {
		this._super();
		if(this.caption instanceof Ember.ComputedProperty && this.get('caption')===null) {
			this.set('caption',this.value);
		}
		this.set('value',this.get('_option.value'));
	},
	
	registerComponent:function(component) {
		this._super(component);
		component.set('value',this.get('value'));
	},
	
	/**
	 * Whether the input is enabled
	 * @property _enabled
	 * @type Boolean
	 * @default true
	 * @private
	 */
	_enabled : true,
	
	/**
	 * Whether the control is enabled or not (alias for private property _enabled)
	 * @property isEnabled
	 * @type Boolean
	 * @default true
	 */
	isEnabled: true,
	
//	setEnabled: function(enabled) {		
//		if(enabled!=this._enabled) {
//			this.set('_enabled',enabled);
//		}
//		this.set('isEnabled',this._enabled && (!this._panel || this._panel.isEnabled));
//	},
//	
	_getPath: function() {
		return (this.get('_panel._path') ? this.get('_panel._path')+'.'+this._name: this._name);
	},
	
	_optionEnabledObserver:Ember.observer('_panel.isEnabled',function() {
		this.setEnabled(this._enabled);
	}),
	
	// We alias the for property for panels and forms
	'for' : Ember.computed(function() {
		return this;
	}),
	
});