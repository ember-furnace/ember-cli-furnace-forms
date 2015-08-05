/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Ember from 'ember';
import Input from 'furnace-forms/components/input';

/**
 * Text input control component
 * 
 * @class Radio
 * @namespace Furnace.Forms.Components
 * @extends Furnace.Forms.Components.Input
 */
export default Input.extend({
	
	attributeBindings: ['type'],
	
	optionControls : Ember.computed.alias('control.optionControls'),
	
	controls : Ember.computed.alias('control.controls'),
	
	type : Ember.computed(function() {
		return Ember.String.camelize(this.constructor.typeKey);
	}),
	
});