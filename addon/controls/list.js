/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Control from './input';
import Radio from 'furnace-forms/components/list/radio';
//import Check from 'furnace-forms/components/list-check';
import Lookup from 'furnace-forms/utils/lookup-class';

/**
 * Action control component proxy 
 * 
 * @class Action
 * @namespace Furnace.Forms.Controls
 * @extends Furnace.Forms.Controls.Abstract
 * @protected
 */
export default Control.extend({
	_component: null,
	
	getComponentClass : function(context,contextName) {
		if(typeof this._component ==="string") {
			return Lookup.call(context,this._component,'input');
		}
		else if(this._component===null) {
			if(this.multiselect) {
				return null
			} else {
				return Radio;
			}
		}
		return this._component;
		
	},
	
	
	multiselect : false,
	
});