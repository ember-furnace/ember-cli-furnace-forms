/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Input from 'furnace-forms/components/input';

/**
 * Action control component
 * 
 * @class Action
 * @namespace Furnace.Forms.Components
 * @extends Furnace.Forms.Components.Abstract
 */
export default Input.extend({
	
	actions : {
		click:function() {
			this.control.submit();
		}
	}
	
	
});