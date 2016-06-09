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
	
	defaultLayoutName: 'forms/form',
	
	classNameBindings: ['_modelClass'],
	
	_rootControl : false,
	
	_forStreamSubscriber: null,
	
	_modelClass : Ember.computed('control._modelName', {
		get :function() {
			if(this.get('control._modelName'))
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
			
			if(this.control.constructor.typeKey) {
				name=getName(this.getFor(),true);
				if(name) {
					ret.pushObject(name.replace(/\./g,'/')+'/form');
				}
				ret.pushObject(this.get('control._modelName').replace(/\./g,'/')+'/form');
				
				var layoutName=this.control.constructor.typeKey.replace(/\./g,'/');
				if(layoutName===this.control.constructor.typeKey) {
					ret.pushObject( 'forms/'+layoutName);
				} else {
					ret.pushObject(layoutName+'/'+this.control._decoratorType);
				}						
			}
			ret.pushObject(this.get('defaultLayoutName'));
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
	
	destroy : function() {
		this._super();
		if(this._rootControl) {
			this.control.destroy();
		}
		if(this._forStreamSubscriber) {
			this._forStreamSubscriber();
		}
	},
	
	type : Ember.computed({
		get :function() {
			return Ember.String.camelize(this.control.constructor.typeKey);
		}
	}).readOnly(),
	
});