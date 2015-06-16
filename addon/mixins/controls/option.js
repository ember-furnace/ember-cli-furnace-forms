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
	
	_componentType : 'input',
	
	_component: null,
	
	actions :{
		select : function() {
			this._panel.send('select',this._option.index,!this.get('selected'));
		}
	},
	
	_name : 'option',
	
	_option : null,
	
	value : Ember.computed.alias('_option.value'),
	
	selected :  Ember.computed.alias('_option.selected'),
	
	caption : Ember.computed.alias('_option.caption'),
		
	optionControl : Ember.computed('_option.control',function() {
		// @TODO: should probably destroy existing control
		if(this._option.control) {
			var options=this._option.control._meta.options;
			options.caption=this.get('caption');
			return getControl.call(this,'value',this._option.control._meta.options._controlType,options);
		}
			
		return null;
	}),
	
	index : Ember.computed.alias('_option.index'),
	
	_input : null,
	
	init: function() {
		this._super();
		if(this.caption instanceof Ember.ComputedProperty && this.get('caption')===null) {
			this.set('caption',this.value);
		}
		
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
	
	setEnabled: function(enabled) {		
		if(enabled!=this._enabled) {
			this.set('_enabled',enabled);
		}
		this.set('isEnabled',this._enabled && (!this._panel || this._panel.isEnabled));
	},
	
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