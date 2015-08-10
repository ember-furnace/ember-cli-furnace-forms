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
	
	defaultLayout: 'forms/form',
	
	classNameBindings: ['_modelClass'],
	
	_modelClass : Ember.computed('control._modelName',function() {
		return this.get('control._modelName').replace(/\./g,'-');
	}),
	
	attributeBindings: ['type'],
	
	layouts: Ember.computed('targetObject,for',function() {
		var name;
		var ret=Ember.A();	
		name=getName(this.get('targetObject'),true);
		if(name) {
			ret.pushObject((name+'/form').replace(/\./g,'/'));
		}
		
		if(this.constructor.typeKey) {
			name=getName(this.get('for'),true);
			if(name) {
				ret.pushObject(name.replace(/\./g,'/')+'/form');
			}
			ret.pushObject(this.get('control._modelName').replace(/\./g,'/')+'/form');
			
			var layoutName=this.constructor.typeKey.replace(/\./g,'/');
			if(layoutName===this.constructor.typeKey) {
				ret.pushObject( 'forms/'+layoutName);
			} else {
				ret.pushObject(layoutName+'/'+this.control._componentType);
			}						
		}
		ret.pushObject(this.get('defaultLayout'));
		return ret;
	}),
	
	
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