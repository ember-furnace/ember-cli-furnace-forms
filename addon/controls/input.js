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
	_component : 'text',
	
	value : Ember.computed('content.value',function() {
		if(this.content)
			return this.content.get('value');
		else 
			return this.get('_panel.for.'+this.get('_name'));
	}),
});