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
	
	defaultLayoutName: 'forms/checklist-option',
	
	
	
	inputId: Ember.computed('elementId',{
		get() {
			return this.elementId+'Input';
		}
	}),
		
	checked : Ember.computed.alias('selected'),
	
	type : 'checklist-option',

	
});