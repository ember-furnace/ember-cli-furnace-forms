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
	
	defaultLayout: 'forms/number',
	
	format : Ember.computed.alias('control.format'),
	
	step : Ember.computed.alias('control.step'),
	
	min : Ember.computed.alias('control.min'),

	max : Ember.computed.alias('control.max'),
	
	real : Ember.computed.alias('control.real'),
	
	precision : Ember.computed.alias('control.precision')
});