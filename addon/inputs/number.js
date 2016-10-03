/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Ember from 'ember';
import Text from 'furnace-forms/inputs/text';

/**
 * Text input control component
 * 
 * @class Text
 * @namespace Furnace.Forms.Components
 * @extends Furnace.Forms.Components.Input
 */
export default Text.extend({
	type: 'number',
	
	defaultLayoutName: 'forms/number',
	
	format : Ember.computed.alias('control.format'),
	
	step : Ember.computed.alias('control.step'),
	
	min : Ember.computed.alias('control.min'),

	max : Ember.computed.alias('control.max'),
	
	real : Ember.computed.alias('control.real'),
	
	precision : Ember.computed.alias('control.precision'),
	
	_valueObserver:Ember.observer('value',function() {
		var value=this.get('value');
		if(value!=='-' && value !==this.get('control.value')) {
			this.set('control.value',value);
		}
	}),
});