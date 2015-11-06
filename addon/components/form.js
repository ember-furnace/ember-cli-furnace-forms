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
	
	_modelClass : Ember.computed('control._modelName', {
		get :function() {
			return this.get('control._modelName').replace(/\./g,'-');
		},
		set : function(key,value) {
			return value;
		}
	}),
	
	attributeBindings: ['type'],
	
	layouts: Ember.computed('targetObject,for',{
		get : function() {
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
		}
	}).readOnly(),
	
	
	init: function() {
		this._super();
	},
	
	'for' : Ember.computed({
		get : function(key,value) {
			if(!this.control) {
				return value;
			}
			if(value) {			
				this.control.set('for',value);
			}
			return this.control.get('for');
		},
		set : function(key,value) {
			return value;
		}
	}),
	
	didInsertElement : function() {
		this._super();
		this.$().on('submit',function(e) {
			e.preventDefault();
			return false;
		});
	},
	
	willClearRender : function() {
		this._super();
		this.$().off('submit');
	},
	
	type : Ember.computed({
		get :function() {
			return Ember.String.camelize(this.control.constructor.typeKey);
		}
	}).readOnly(),
	
});