/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Ember from 'ember';
import ControlSupport from 'furnace-forms/mixins/controls/control-support';
import getControl from 'furnace-forms/utils/get-control';
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
	
	_decoratorType : 'input',
	
	_decoratorName: null,
	
	actions :{
	},
	
	select : function() {
		var selected=!this.get('selected');
		this._panel.select(this._option.index,selected);
	},
	
	_name : 'option',
	
	_option : null,
	
	value : null,
	
	_valueObserver:Ember.observer('value',function() {
		this._super();
		if(this.get('_option.value')!==this.value) {
			var selected=this.get('selected');
			if(selected) {
				this._panel.select(this._option.index,false);
			}
			this.set('_option.value',this.value);
			if(selected) {
				this._panel.select(this._option.index,true);
			}
		}
	}),
	
	_optionObserver:Ember.observer('_option.value',function() {
		this.set('value',this._option.value);
	}),
		
	selected :  Ember.computed.alias('_option.selected'),
	
	caption : Ember.computed.alias('_option.caption'),
	
	showOptionControl : Ember.computed('optionControl,selected', {
		get : function() {
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
		}
	}).readOnly(),
	
	_optionControl : null,
	
	optionControl : Ember.computed('_option.control',{
		get : function() {
			// @FIXME: I should only destroy and recreate control if it differs -> should work with extend of ControlOption
			if(this._option.control) {
				if(this._optionControl !== null) {
					this.get('_controls').removeObject(this._optionControl);
					this._optionControl.destroy();
				} 
				var meta=this._option.control;				
				this._optionControl= getControl.call(this,'value',meta,{
					caption: Ember.computed.alias('_panel.caption')	
				});
			}
			return this._optionControl;
		}
	}).meta({type : 'form-control'}),
	
	
	setValid : function(valid) {
		Ember.run.scheduleOnce('actions',this,function() {
			if(this.isDestroyed) {
				Ember.warn('Attempting to change validity of destroyed object '+this.toString());
				return;
			}
			if(this._valid!==valid) {				
				this.set('_valid',valid);
			}
			if(this.get('selected')) {
				valid= valid!==false && this.get('controls').filterBy('isValid',false ).get('length')===0;
			}
			if(valid!==this.get('isValid')) {
				this.setFlag('isValid',valid);
				this.notifyChange();
			}
		});
	},
	
	
	index : Ember.computed.alias('_option.index'),
	
	_input : null,
	
	init: function() {
		// Our controls may depend on our value. Set it before calling our super function
		this.set('value',this.get('_option.value'));
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
	
	_model : Ember.computed.alias('for'),
	
	// We alias the for property for panels and forms
	'for' : Ember.computed({
		get : function() {
			return this;
		}
	}).readOnly(),
	
});