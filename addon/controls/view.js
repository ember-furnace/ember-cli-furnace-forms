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
	
	init : function() {
		this._super();
		// If we do not have a name, we're an anonymous option without a counterpart in 
		if(this.get('_name')) {
			if(this.get('_panel.for.'+this.get('_name'))!==undefined) {	
				this.reopen({
					value:Ember.computed.alias('_panel.for.'+this.get('_name'))
				});
			}
			else {
				this.reopen({
					value:Ember.computed.alias('_panel.for')
				});
			}
			
		}			
	}
//	getComponentClass : function(context,contextName) {
//		var view=this._component
//		if(typeof view ==="string") {
//			view = context.get('container').lookup('view:'+view);
//		}
//		return view;
//	},
	
});