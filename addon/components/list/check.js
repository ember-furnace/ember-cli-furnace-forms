/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Ember from 'ember';
import Input from 'furnace-forms/components/list';
import Option from './check-option';


/**
 * Text input control component
 * 
 * @class Radio
 * @namespace Furnace.Forms.Components
 * @extends Furnace.Forms.Components.Input
 */
export default Input.extend({
	
	optionClass : Option,
	
	layoutName: function() {		
		if(this.constructor.typeKey)
			return this._super();
		return 'forms/list/check' ;
	}.property(),
});