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
	
	attrTarget: null,
	
	attrList: null,
	
	
	_modelName : null,
    
	_modelNameObserver: Ember.observer('control._modelName',function() {
		Ember.run.scheduleOnce('sync',this,this._updateModelName);
	}).on('init'),
	
	_updateModelName: function() {
		if(this.get('_modelName')!==this.get('control._modelName')) {
			this.set('_modelName',this.get('control._modelName'));
		}
	},
	
	_modelClass : Ember.computed('_modelName', {
		get :function() {
			if(this.get('_modelName')) {
				return this.get('_modelName').replace(/\./g,'-');
			}
		},
		set : function(key,value) {
			return value;
		}
	}),
	
	attributeBindings: ['type'],
	
	layouts: Ember.computed('control',{
		get : function() {
			var name;
			var ret=Ember.A();	
			name=getName(this.get('control'),true);
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
		if(this.control._rootControl) {
			this.control.destroy();
		}		
	},
	
	type : Ember.computed({
		get :function() {
			return Ember.String.camelize(this.control.constructor.typeKey);
		}
	}).readOnly(),
	
	updateAttributes : Ember.on('didReceiveAttrs',function(attrs) {
		var opts={};
		if(attrs.newAttrs && attrs.newAttrs.attrList) {
			var list=this.get('attrList');
			for(let index in list) {
				opts[list[index]]=Ember.computed.alias('attrSource.'+list[index]);
			}
			this.reopen(opts);
		}
	})
	
});