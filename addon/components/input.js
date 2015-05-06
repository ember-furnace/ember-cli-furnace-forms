/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Ember from 'ember';
import Control from './abstract';

/**
 * Input control component
 * 
 * @class Input
 * @namespace Furnace.Forms.Components
 * @extends Furnace.Forms.Components.Abstract
 */
export default Control.extend({
	
	attributeBindings: ['type'],
	
	
	
	defaultLayout: 'forms/input',
	
	
	inputId: null,

	value: null,
	
	_valueObserver:function() {
		this.set('control.value',this.get('value'));
	}.observes('value'),
	
	inputInsert:function() {
		this.set('targetObject.inputId',this.elementId);
	},
	
	disabledAttr:function() {
		return this.get('isEnabled') ? null : 'disabled';
	}.property('isEnabled'),

	
	type : Ember.computed(function() {
		return Ember.String.camelize(this.constructor.typeKey);
	}),
});