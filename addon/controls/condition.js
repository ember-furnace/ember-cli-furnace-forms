/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Panel from './panel';
import Component from '../components/condition';

/**
 * Condition control component proxy 
 * 
 * @class Condition
 * @namespace Furnace.Forms.Controls
 * @extends Furnace.Forms.Controls.Panel
 * @protected
 */
export default Panel.extend().reopenClass({
	_component: Component,
	
	generate : function(options) {
		options=options || {};
		options._condition=options._conditionFn.property(options._conditionProps);
		return this._super(options);
	}
});