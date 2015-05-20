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
		if(!this.get('isEnabled')) {
			if(this.get('hasPrerequisites')===false)
				this.send('validate');
			return;
		}
		this.send(this._name,this);		
	},
	
	submit : function() {
		if(!this.get('isEnabled')) {
			if(this.get('hasPrerequisites')===false)
				this.send('validate');
			return;
		}
		this.send('submit',this._name);
	},
	
	init: function() {
		this._super();
		this.updateEnabled();
	},
	
	updateEnabled:Ember.observer('hasPrerequisites',function() {
		if(this.get('hasPrerequisites')!==false) {
			this.setEnabled(true);					
		} else {
			this.setEnabled(false);			
		}
	}),
});