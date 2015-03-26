/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Control from './abstract';
import Component from 'furnace-forms/components/action';

/**
 * Action control component proxy 
 * 
 * @class Action
 * @namespace Furnace.Forms.Controls
 * @extends Furnace.Forms.Controls.Abstract
 * @protected
 */
export default Control.extend({
	_component: Component,
	
	caption : null,
	
	extendHash: function(hash) {
		var ret=this._super(hash);
		if(!hash.caption) {
			ret.caption=this.caption;
		}		
		ret.submit=this.submit;
		return ret;
	}
});