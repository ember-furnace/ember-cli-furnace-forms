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
	
	classNameBindings : ['_emptyClass'],
	
	defaultLayoutName: 'forms/input',
	
	isEmpty: Ember.computed.alias('control.isEmpty'),
	

	_emptyClass : Ember.computed('isEmpty',{
		get : function() {
			if(this.get('isEmpty')===true) {
				return 'empty';
			}
			return null;
		}
	}).readOnly(),
	
	
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
			if(this.control.constructor.typeKey!=='default')
				return Ember.String.camelize(this.control.constructor.typeKey);
			else
				return 'input';
		}
	}).readOnly(),
});