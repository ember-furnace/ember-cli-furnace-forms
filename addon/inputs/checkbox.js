/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Ember from 'ember';
import Control from 'furnace-forms/components/input';

import CheckedSupport from 'furnace-forms/mixins/components/checked-support';
/**
 * Text input control component
 * 
 * @class Text
 * @namespace Furnace.Forms.Components
 * @extends Furnace.Forms.Components.Input
 */
export default Control.extend(CheckedSupport,{
	checkedValue:true,
	uncheckedValue: null,
	
	defaultLayout: 'forms/list/radio-option',
	
	name : Ember.computed.alias('_name'),
	
	inputId: function() {
		return this.elementId+'-'+this.index;
	}.property('elementId'),
		
	checked : Ember.computed.alias('selected'),
		
	_update: Ember.observer('selected',function() {
		if(this.get('selected')) {
			this.set('value',this.get('checkedValue'));
		}else {
			this.set('value',this.get('uncheckedValue'));
		}
	})	
});