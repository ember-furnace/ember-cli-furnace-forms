/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Control from './abstract';
import Ember from 'ember';

/**
 * Action control component proxy 
 * 
 * @class Action
 * @namespace Furnace.Forms.Controls
 * @extends Furnace.Forms.Controls.Abstract
 * @protected
 */
export default Control.extend({
	_decoratorType : 'input',
	
	_decoratorName : 'button',
	
	tabindex: 0,
	
	dispatch : function() {
		if(!this.get('isEnabled')) {
			if(this.get('hasPrerequisites')===false) {
				this.send('validate');
			}
			return;
		}
		this.send(this._name,this.getForm(),this);		
	},
	
	submit : function() {
		if(!this.get('isEnabled')) {
			if(this.get('hasPrerequisites')===false) {
				this.send('validate');
			}
			return;
		}
		this.send('submit',this._name);
	}
	
	
});