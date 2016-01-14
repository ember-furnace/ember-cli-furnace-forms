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
	
	
	
	defaultLayoutName: 'forms/input',
	
	
	inputId: Ember.computed('elementId',{
		get : function() {
			return this.elementId+'-input';
		}
	}),

	value: null,
	
	
	_valueObserver:Ember.observer('value',function() {
		if(this.get('value')!==this.get('control.value')) {
			this.set('control.value',this.get('value'));
		}
	}),
	
	inputInsert:function() {
		Ember.deprecate('Furnace-forms: the use of input insert is deprecated',false,{id:'furnace-forms:component.input-insert'});
	},
	
	disabledAttr:Ember.computed('isEnabled',{
		get :function() {
			return this.get('isEnabled') ? null : 'disabled';
		}
	}).readOnly(),

	
	type : Ember.computed('control',{ 
		get  :function() {			
			return Ember.String.camelize(this.control.constructor.typeKey);
		}
	}).readOnly(),
});