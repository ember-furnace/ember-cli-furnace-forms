/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Input from 'furnace-forms/components/input';
import Ember from 'ember';

/**
 * Action control component
 * 
 * @class Action
 * @namespace Furnace.Forms.Components
 * @extends Furnace.Forms.Components.Abstract
 */
export default Input.extend({

	actions : {
		click:function() {
			this.control.submit();
		}
	},

	title: Ember.computed('control.title', {
		get() {
			return this.get('control.title');
		}
	}),
	
	tabindex: Ember.computed({
		get() {
			return this.get('control.tabindex');
		},
		set(key,value) {
			return value;
		}
	})
});