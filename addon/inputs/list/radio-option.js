/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Ember from 'ember';
import Input from 'furnace-forms/components/list-option';

import CheckedSupport from 'furnace-forms/mixins/checked-support';
/**
 * Text input control component
 * 
 * @class Text
 * @namespace Furnace.Forms.Components
 * @extends Furnace.Forms.Components.Input
 */
export default Input.extend(CheckedSupport,{
	
	
	defaultLayout: 'forms/list/radio-option',
	
	name : Ember.computed.alias('_name'),
	
	inputId: function() {
		return this.elementId+'-'+this.index;
	}.property('elementId'),
		
	checked : Ember.computed.alias('selected'),
		
	click : function(event) {
		if(event.toElement.id===this.get('inputId')) {
			this.send('select',this.index);
		}
	}
});