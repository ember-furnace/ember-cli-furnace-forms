/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Ember from 'ember';
import Text from 'furnace-forms/inputs/text';
import I18n from 'furnace-i18n';
/**
 * Text input control component
 * 
 * @class Text
 * @namespace Furnace.Forms.Components
 * @extends Furnace.Forms.Components.Input
 */
export default Text.extend({
	i18nService: Ember.inject.service('i18n'),
	
	type: 'number',
	
	defaultLayoutName: 'forms/number',
	
	format : Ember.computed.alias('control.format'),
	
	step : Ember.computed.alias('control.step'),
	
	min : Ember.computed.alias('control.min'),

	max : Ember.computed.alias('control.max'),
	
	real : Ember.computed.alias('control.real'),
	
	precision : Ember.computed.alias('control.precision'),
	
	_value: null,
	
	actions: {
		
		blur() {
			this._super(...arguments);
			this.set('value',this.get('control.value'));
		}
	},
	
	value: Ember.computed('_value',{
		get() {
			value=this.get('_value');
			if(value===null) {
				return '';
			} else {
				return this.get('i18nService').numberToLocale(value); 
			}
		},
		set(key,value) {
			if(value==='') {				
				this.set('_value',value);
			} else if(typeof value==='string') {
				this.set('_value',this.get('i18nService').numberFromLocale(value));
			} else if(typeof value==='number') {
				if(isNaN(value)) {
					value='';
				} else {
					value=this.get('i18nService').numberToLocale(value);
				}
			}
			return value;
		}
	}),
	
	_valueObserver:Ember.observer('_value',function() {
		var value=this.get('_value');
		if(value!=='-' && value !==this.get('control.value')) {
			this.set('control.value',value);			
		}
	}),
	
});