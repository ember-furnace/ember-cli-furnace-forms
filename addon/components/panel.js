import Control from './abstract';
import Action from 'furnace-forms/controls/action';
import Ember from 'ember';
import getName from 'furnace-forms/utils/get-name';

export default Control.extend({
	tagName : 'panel',
	
	'for': null,
	
	_controls : null,
	
	init: function() {
		this._super();
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
	
	_modelName : function() {
		if(this.get('for')) {
			return getName(this.get('for'));
		}
		else {
			return null;
		}
	}.property('for'),
	
	_targetName : function() {
		if(this.get('targetObject')) {
			return getName(this.get('targetObject'));
		}
		else {
			return null;
		}
	}.property('targetObject'),
	
	isDirty:function() {
		return this.get('controls').filterBy('isDirty', true).get('length')>0;
	}.property('inputControls.@each.isDirty'),
	
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
		this.get('inputControls').invoke('_reset');
	},
});