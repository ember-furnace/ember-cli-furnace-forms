/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Ember from 'ember';
import Control from './abstract';
import ControlSupport from 'furnace-forms/mixins/control-support';
import I18n from 'furnace-i18n';
/**
 * Input control component proxy 
 * 
 * @class Input
 * @namespace Furnace.Forms.Controls
 * @extends Furnace.Forms.Controls.Abstract
 * @protected
 */
export default Ember.Object.extend(ControlSupport,{
	
	value : null,
	
	selected : false,
	
	caption : I18n.computed(null),
		
	control : null,
	
	input : null,
	
	init: function() {
		if(this.caption instanceof Ember.ComputedProperty && this.get('caption')===null) {
			this.set('caption',this.value);
		}
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
		this.set('isEnabled',this._enabled && (!this._input || this._input.isEnabled));
	},
	
	_optionEnabledObserver:Ember.observer('_input.isEnabled',function() {
		this.setEnabled(this._enabled);
	}),
		
	'for' : Ember.computed.alias('value')
});