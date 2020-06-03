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
	type : 'checkbox',

	actions: {
		toggle() {
			if(this.get('isEnabled')) {
				this.toggleProperty('checked');
			}
		}
	},

	checkedValue:Ember.computed({
		get: function() {
			if(this.control && this.control.hasOwnProperty('_checkedValue')) {
				return this.get('control._checkedValue');
			}
			return true;
		}
	}),
	
	uncheckedValue: Ember.computed({
		get: function() {
			if(this.control && this.control.hasOwnProperty('_uncheckedValue')) {
				return this.get('control._uncheckedValue');
			}
			return null;
		}
	}),
	
	defaultLayoutName: 'forms/checkbox',
	
	name : Ember.computed.alias('_name'),
	
	inputId: Ember.computed('elementId',{
		get() {
			return this.elementId+'Input';
		}
	}),
		
	checked : Ember.computed('value', {
		get : function() {
			if(this.get('value')===this.get('checkedValue')) {
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
		if(this.get('value')===this.get('checkedValue')) {
			this.set('checked',true);
		} else { 
			this.set('checked',false);
		}
		this.$('#'+Ember.get(this,'inputId')).prop('checked',this.get('checked'));
	}),

	click : function(event) {
		var target= event.target;
		if(target.tagName==='INPUT' && target.id===this.get('inputId') && this.get('isEnabled')) {
			if(this.get('value')===this.get('checkedValue')) {
				this.set('value',this.get('uncheckedValue'));
			} else {
				this.set('value',this.get('checkedValue'));
			}
		}
	},

	keyPress:function(event) {
		var target= event.target;
		if(event.which===32) {
			if(target.tagName!=='INPUT' || target.id!==this.get('inputId') ) {
				this.send('toggle');
				event.preventDefault();
				return false;
			}
		}
	},

});