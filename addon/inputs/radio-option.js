/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Ember from 'ember';
import Input from 'furnace-forms/components/option';

import CheckedSupport from 'furnace-forms/mixins/components/checked-support';
/**
 * Text input control component
 * 
 * @class Text
 * @namespace Furnace.Forms.Components
 * @extends Furnace.Forms.Components.Input
 */
export default Input.extend(CheckedSupport,{
	
	
	defaultLayoutName: 'forms/list/radio-option',
	
	
	
	inputId: function() {
		return this.elementId+'Input';
	}.property('elementId'),
		
	checked : Ember.computed.alias('selected'),
		
	click : function(event) {
		var target=event.toElement || event.target;
		if(target.id===this.get('inputId')) {
			this.control.select();
		}
	},
	
	type : 'radio-option'
});