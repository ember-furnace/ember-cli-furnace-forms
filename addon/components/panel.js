/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Control from './abstract';
import Action from 'furnace-forms/controls/action';
import Ember from 'ember';
import ControlSupport from 'furnace-forms/mixins/control-support';
import getName from 'furnace-forms/utils/get-name';

/**
 * Panel component
 * 
 * @class Panel
 * @namespace Furnace.Forms.Components
 * @extends Furnace.Forms.Components.Abstract
 */
export default Control.extend(ControlSupport,{
	tagName : 'panel',
	
	'for': null,
	
	modelName: Ember.computed.alias('_modelName'),
	
	init: function() {
		this._super();		
		if(this._panel && this.get('for')===this.get('_panel.for')) {
			this.set('_path',this.get('_panel._path'));
		}		
	},
	
	actions: {
		apply:function() {
			this.sendAction('willApply');
							
			this._apply();
			
			this.sendAction('didApply');
		}
	},
	
	willApply: null,
	
	didApply: null,
	
//	layoutName: function() {
//		if(!this.get('container')) {
//			return null;
//		}
//		if(this.constructor.typeKey) {
//			var layoutName=this.constructor.typeKey.replace(/\./g,'/');
//			if(layoutName===this.constructor.typeKey) {
//				return 'forms/'+layoutName;
//			}
//			return layoutName+'/panel';
//		}
//		return 'forms/panel' ;
//	}.property(),
	
	_staticModelName : null,
	
	_modelName : Ember.computed('for',function(key,value) {
		if(value)  {
			return value;
		}	
		if(this.get('for')===this.get('_panel.for')) {
			return this.get('_panel._modelName');
		}
		else if(this.get('for')) {
			return getName(this.get('for'));
		}
		else {
			return null;
		}
	}),
	
	_targetName : function() {
		if(this.get('targetObject')) {
			return getName(this.get('targetObject'));
		}
		else {
			return null;
		}
	}.property('targetObject'),
	
	caption : null,
	
	inputControls: Ember.computed(function() {
		var ret = Ember.A();
		var self = this;
		this.constructor.eachComputedProperty(function(name, meta) {
			if (meta.type==='form-control' && !(self.get(name) instanceof Action)) {
				ret.pushObject(self.get(name));
			}
		});
		return ret;
	}).readOnly(),
	
	actionControls: Ember.computed(function() {
		var ret = Ember.A();
		var self = this;
		this.constructor.eachComputedProperty(function(name, meta) {
			if (meta.type==='form-control' && (self.get(name) instanceof Action)) {
				ret.pushObject(self.get(name));
			}
		});
		return ret;
	}).readOnly(),
	
	_apply:function() {
		this.get('inputControls').invoke('_apply');
	},
	
	_reset:function() {
		this._super();
		this.get('inputControls').invoke('_reset');
	},
});