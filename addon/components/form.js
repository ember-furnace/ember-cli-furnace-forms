/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Ember from 'ember';
import Panel from './panel';
import getName from 'furnace-forms/utils/get-name';

/**
 * Form component
 * 
 * @class Form
 * @namespace Furnace.Forms.Components
 * @extends Furnace.Forms.Components.Panel
 */
export default Panel.extend({
	tagName: 'form',
	
	classNameBindings: ['control._name','control._modelName'],
	
	attributeBindings: ['type'],
	
	layoutName: function() {
		if(!this.get('container')) {
			return null;
		}
		var name=getName(this.get('targetObject'),true)+'/form';
		if(name!==null)
			name=name.replace(/\./g,'/');
		if(!this.get('container').lookup('template:'+name)) {
			if(getName(this.get('for'),true)) {
				name=getName(this.get('for')).replace(/\./g,'/')+'/form';
			}
			if(!name || !this.get('container').lookup('template:'+name)) {
				if(this.get('control._modelName')) {
					name=this.get('control._modelName').replace(/\./g,'/')+'/form';
				}
				if(!name || !this.get('container').lookup('template:'+name)) {
					name='forms/form';
				}
			}
		}
		return name ;
	}.property('targetObject','for'),
	
	init: function() {
		this._super();
	},
	
	'for' : Ember.computed(function(key,value) {
		if(!this.control) {
			return value;
		}
		if(value) {			
			this.control.set('for',value);
		}
		return this.control.get('for');
	}),
	
	type : Ember.computed(function() {
		return Ember.String.camelize(this.control.constructor.typeKey);
	}),
	
});