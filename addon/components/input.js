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
	
	
	_valueObserver:Ember.observer('value',function() {
		if(this.get('value')!==this.get('control.value')) {
			this.set('control.value',this.get('value'));
		}
	}),
	
	inputInsert:function() {
		this.set('targetObject.inputId',this.elementId);
	},
	
	disabledAttr:Ember.computed('isEnabled',{
		get :function() {
			return this.get('isEnabled') ? null : 'disabled';
		}
	}).readOnly(),

	
	type : Ember.computed({ 
		get  :function() {
			return Ember.String.camelize(this.constructor.typeKey);
		}
	}).readOnly(),
});