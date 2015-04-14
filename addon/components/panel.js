/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Control from './abstract';
import Action from 'furnace-forms/controls/action';
import Ember from 'ember';
import getName from 'furnace-forms/utils/get-name';

/**
 * Panel component
 * 
 * @class Panel
 * @namespace Furnace.Forms.Components
 * @extends Furnace.Forms.Components.Abstract
 */
export default Control.extend({
	tagName : 'panel',
	
	'for': null,
	
	_controls : null,
	
	init: function() {
		this._super();
		if(this._panel && this.get('for')===this._panel['for']) {
			this.set('_path',this.get('_panel._path'));
		}		

		this._controls={};
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
	
	layoutName: function() {
		if(!this.get('container')) {
			return null;
		}
		if(this.constructor.typeKey) {
			var layoutName=this.constructor.typeKey.replace(/\./g,'/');
			if(layoutName===this.constructor.typeKey) {
				return 'forms/'+layoutName;
			}
			return layoutName+'/panel';
		}
		console.log(this);
		return 'forms/panel' ;
	}.property(),
	
	setEnabled: function(enabled) {
		if(enabled!=this._enabled) {
			this.set('_enabled',enabled);
			for(var index in this._controls) {
				this._controls[index].setEnabled(enabled);
			}
		}
	},
	
	_modelName : Ember.computed('for',function(key,value) {
		if(value)  {
			return value;
		}	
		if(this.get('for')===this.get('_form.for')) {
			return this.get('_form._modelName');
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
	
	_dirty:function() {
		return this.get('controls').filterBy('isDirty', true).get('length')>0;
	}.property('inputControls.@each.isDirty'),
	
	_dirtyObserver:function() {
		this.set('isDirty',this.get('_dirty'));
	}.observes('inputControls.@each.isDirty'),
	
	isDirty: false,
	
	_validObserver:function() {
		this.setValid(this.get('controls').filterBy('isValid',false ).get('length')===0);
	}.observes('inputControls.@each.isValid'),
	
	controls: Ember.computed(function() {
		var ret = Ember.A();
		var self = this;
		this.constructor.eachComputedProperty(function(name, meta) {
			if (meta.type==='form-control') {
				ret.pushObject(self.get(name));
			}
		});
		return ret;
	}).readOnly(),
	
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