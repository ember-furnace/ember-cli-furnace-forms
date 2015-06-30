/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Ember from 'ember';
import Input from 'furnace-forms/components/list';


/**
 * Text input control component
 * 
 * @class Radio
 * @namespace Furnace.Forms.Components
 * @extends Furnace.Forms.Components.Input
 */
export default Input.extend({
	
	defaultLayout: 'forms/list',

	itemControls : Ember.computed.alias('control.itemControls'),
	
	inputControls : Ember.computed.alias('control.inputControls'),
	
	actionControls : Ember.computed.alias('control.actionControls'),
});