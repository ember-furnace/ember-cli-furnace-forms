/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Ember from 'ember';
import Control from 'furnace-forms/components/option';
/**
 * Text input control component
 * 
 * @class Text
 * @namespace Furnace.Forms.Components
 * @extends Furnace.Forms.Components.Input
 */
export default Control.extend({
	
	tagName : 'radio-option',
	
	inputId: null,

	inputInsert:function() {
		this.set('targetObject.inputId',this.elementId);
	},
	
	layoutName: function() {			
		return 'forms/radio/option' ;
	}.property(),
});