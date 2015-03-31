/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Ember from 'ember';
import Control from 'furnace-forms/components/input';
import Option from './radio-option';
/**
 * Text input control component
 * 
 * @class Text
 * @namespace Furnace.Forms.Components
 * @extends Furnace.Forms.Components.Input
 */
export default Control.extend({
	optionClass : Option,
	
	name : Ember.computed.alias('_name'),
	
	layoutName: function() {		
		if(this.constructor.typeKey!=='radio')
			return this._super();
		return 'forms/radio/input' ;
	}.property(),
});