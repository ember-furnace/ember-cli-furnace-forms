/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Input from './input';
import Ember from 'ember';
/**
 * Conditional panel component
 * 
 * @class Condition
 * @namespace Furnace.Forms.Components
 * @extends Furnace.Forms.Components.Panel
 */
export default Input.extend({
	
	tagName : 'panel',
	
	controls : Ember.computed.alias('control.controls'),
	
	inputControls : Ember.computed.alias('control.inputControls'),
	
	actionControls : Ember.computed.alias('control.actionControls'),
	
	init : function() {
		this._super();
		Ember.warn('You did not specify a condition for the control rendering the conditionpanel '+this.get('name'),this.get('hasPrerequisites')!==null,{id:'furnace-forms:component.condition.not-specified'});
	} 
	
});