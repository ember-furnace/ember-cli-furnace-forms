/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Ember from 'ember';
import Control from './abstract';


/**
 * Input control component proxy 
 * 
 * @class Input
 * @namespace Furnace.Forms.Controls
 * @extends Furnace.Forms.Controls.Abstract
 * @protected
 */
export default Control.extend({
	_component : 'view',
	
//	getComponentClass : function(context,contextName) {
//		var view=this._component
//		if(typeof view ==="string") {
//			view = context.get('container').lookup('view:'+view);
//		}
//		return view;
//	},
	
});