/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Control from './abstract';
import ValueSupport from 'furnace-forms/mixins/controls/value-support';
/**
 * Input control component proxy 
 * 
 * @class Input
 * @namespace Furnace.Forms.Controls
 * @extends Furnace.Forms.Controls.Abstract
 * @protected
 */
export default Control.extend(ValueSupport,{
	_decoratorName : 'input',
	
	_decoratorType : 'input',
	
	tabindex: null
	
}).reopenClass({
	targetProperty: function(cp) {
		return this.reopen({
			property:cp
		});
	}
});