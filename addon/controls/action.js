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
	
	dispatch : function() {
		if(!this.get('isEnabled')) {
			if(this.get('hasPrerequisites')===false) {
				this.send('validate');
			}
			return;
		}
		this.send(this._name,this);		
	},
	
	submit : function() {
		if(!this.get('isEnabled')) {
			if(this.get('hasPrerequisites')===false) {
				this.send('validate');
			}
			return;
		}
		this.send('submit',this._name);
	},
	
	init: function() {
		this._super();
		// We should schedule updateEnabled to make sure it not runs before hasPrerequisites may have updated in the current runloop
		Ember.run.scheduleOnce('sync',this,this.updateEnabled);
	},
	
	updateEnabled:Ember.observer('hasPrerequisites',function() {
		if(this.get('hasPrerequisites')!==false) {
			this.setEnabled(true);					
		} else {
			this.setEnabled(false);			
		}
	}),
});