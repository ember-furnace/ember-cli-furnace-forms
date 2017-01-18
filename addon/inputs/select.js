/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Ember from 'ember';
import Input from 'furnace-forms/components/input';
import Placeholder from 'furnace-forms/mixins/components/placeholder';

/**
 * Text input control component
 * 
 * @class Radio
 * @namespace Furnace.Forms.Components
 * @extends Furnace.Forms.Components.Input
 */
export default Input.extend(Placeholder,{
	
	type : 'select',
	
	defaultLayoutName: 'forms/select',
	
	actions : {
		selectionChanged : function(newIndex) {
			if(newIndex) {
				this.control.select(newIndex);
			}
		}
	},
	
	selectedIndex : Ember.computed.alias('control.selectedIndex'),
	
	disabled : Ember.computed('isEnabled',{
		get :function() {
			return !this.get('isEnabled');
		}		
	}).readOnly(),
	
	selectionChanged : function() {
		Ember.run.later(this,function() {
			this.get('control').send('selectionChanged',this.get('value'));
		});
	}
	
});