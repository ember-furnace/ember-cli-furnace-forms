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
	
	defaultLayout: 'forms/checkbox',
	
	name : Ember.computed.alias('_name'),
	
	inputId: function() {
		return this.elementId+'Input';
	}.property('elementId'),
		
	checked : Ember.computed('value', {
		get : function() {
			if(this.get('value')===this.checkedValue) {
				return true;
			}
			return false;
		},
		set : function(key,value) {
			if(value===true) {
				this.set('value',this.get('checkedValue'));
			} else {
				this.set('value',this.get('uncheckedValue'));
			}
			return value;
		}
	}),
	
	init: function() {
		this._super();
		this.get('value');
	},
	
	_checkedObserver: Ember.observer('value',function() {
		if(this.get('value')===this.checkedValue)
			this.set('checked',true);
		else 
			this.set('checked',false);
		this.$('#'+Ember.get(this,'inputId')).prop('checked',this.get('checked'));
	}),
	
});