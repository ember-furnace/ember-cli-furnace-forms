/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Control from './panel';
import Component from 'furnace-forms/components/form';
import Lookup from 'furnace-forms/utils/lookup-class';
/**
 * Form control component proxy 
 * 
 * @class Form
 * @namespace Furnace.Forms.Controls
 * @extends Furnace.Forms.Controls.Abstract
 * @protected
 */
export default Control.extend({
	_component: null,

	getComponentClass : function(context,contextName) {
		var component=this._component
		if(typeof component ==="string") {
			component = Lookup.call(context,this._component,'form');
		}
		if(this._extend) {
			var typeKey=component.typeKey;
			component= component.extend(this._extend);
			component.typeKey=typeKey;
		}		

		return component;
		
	},
	
});