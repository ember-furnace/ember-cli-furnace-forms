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
	
//	_rendered : false,
//	isVisible: Ember.computed.alias('_condition'),
	
	init : function() {
		this._super();
		Ember.warn('You did not specify a condition for the control rendering the conditionpanel '+this.get('name'),this.get('hasPrerequisites')!==null,{id:'furnace-forms:component.condition.not-specified'});
	} 
	
//	render : function(buffer) {
//		if(this.get('_condition')) {			
//			this._rendered=true;
//			this._super(buffer);
//		} else {
//			this._rendered=false;
//		}
//	},
//	
//	shouldRerender: function() {
//		if(this.get('_condition') && !this._rendered) {
//			this.rerender();
//		}
//		else if(!this.get('_condition') && this._rendered) {
//			this.rerender();
//		}
//	}.observes('_condition')
	
//	layoutName: function() {
//		if(!this.get('container')) {
//			return null;
//		}
//		var name="forms/condition";
//		return name ;
//	}.property(),
});