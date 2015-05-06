/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Control from './abstract';

/**
 * Action control component proxy 
 * 
 * @class Action
 * @namespace Furnace.Forms.Controls
 * @extends Furnace.Forms.Controls.Abstract
 * @protected
 */
export default Control.extend({
	_componentType : 'input',
	_component : 'button',
	
	dispatch : function() {
		if(!this.get('isEnabled'))
			return;
		this.send(this._name,this);		
	},
	
	submit : function() {
		if(!this.get('isEnabled'))
			return;
		this.send('_submit',this._name);
	}
});