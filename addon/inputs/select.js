/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Ember from 'ember';
import Input from 'furnace-forms/components/input';
import Placeholder from 'furnace-forms/mixins/components/placeholder';

/**
 * Text input control component
 * 
 * @class Radio
 * @namespace Furnace.Forms.Components
 * @extends Furnace.Forms.Components.Input
 */
export default Input.extend(Placeholder,{
	
	defaultLayout: 'forms/select',
	
	disabled : Ember.computed('isEnabled',function() {
		return !this.get('isEnabled');
	}),
});