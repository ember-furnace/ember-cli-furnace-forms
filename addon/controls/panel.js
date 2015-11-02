/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Control from './abstract';
import Ember from 'ember';

import DS from 'ember-data';
import getName from 'furnace-forms/utils/get-name';
import ControlSupport from 'furnace-forms/mixins/controls/control-support';
import Proxy from 'furnace-forms/proxy';
/**
 * Panel control component proxy 
 * 
 * @class Panel
 * @namespace Furnace.Forms.Controls
 * @extends Furnace.Forms.Controls.Abstract
 * @protected
 */
export default Control.extend(ControlSupport,{
	_component : 'panel',
	
	'for' : null,
	
	_model : Ember.computed.alias('for'),
	
	modelName: Ember.computed.alias('_modelName'),
	
	init: function() {
		this._super();
	},
	
	actions: {
		apply:function() {
			this._apply();
		},
		reset : function() {
			this._reset();
		},
	},
	
	setEnabled: function(enabled) {		
		if(enabled!==this._enabled) {
			this.set('_enabled',enabled);
		}
		this.setFlag('isEnabled',this._enabled && (!this._panel || (this.get('_panel.isEnabled') && this.get('_panel.hasPrerequisites')!==false)));
	},
	
	_panelPrerequisitesObserver:Ember.observer('_panel._condition',function() {
		this.setEnabled(this._enabled);
	}),
	

	
	_modelName : Ember.computed('_model',function(key,value) {
		if(value)  {
			return value;
		}	
		if(this.get('_model')===this.get('_panel._model')) {
			return this.get('_panel._modelName');
		}
		else if(this.get('_model')) {
			var name= getName(this.get('_model'),true);
			if(name)
				return name;
			return this.get('_panel._modelName')+'.'+this._name;
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
	
	_apply:function() {
		this._super();
		this.get('inputControls').invoke('_apply');
		if((!this._form || this.get('_model')!==this._form.get('_model')) && this.get('_model') instanceof Proxy) {
			this.get('_model')._apply();
		}
	},
	
	
	_registerControl : function(control) {
		if(this._path !== this._panel._path) {
			this._form._registerControl(control);
		}
	},
	
	_unregisterControl : function(control) {
		if(this._path !== this._panel._path) {
			this._form._registerControl(control);
		}
	},
	
	_reset:function(modelChanged) {
		this._super(modelChanged);
	},
	
}).reopenClass({
	
	generate : function(mixins,options) {
		options=options || {};
		mixins=mixins || [];	
		if(!options['for']) {
//			if(options._panel && options._panel._isFormOption) {
//				options['for']=Ember.computed.alias('_panel.for');
//			} else
			
			if(options._name!==null && Ember.Enumerable.detect(options._panel.get('_model'))) {
				if(options._panel.get('_model') instanceof DS.ManyArray) {
					options['for']=Ember.computed('_panel._model',function() {
						if(!this.get('_panel._model')) {
							return undefined;
						}
						return this.get('_panel._model').objectAt(this._name);
					});
				} else {
					options['for']=Ember.computed.alias('_panel._model.'+options._name);
				}
			}
			else if(options._panel.get('_model') && options._panel.get('_model.'+options._name)!==undefined) {
				options['for']=Ember.computed.alias('_panel._model.'+options._name);
			} else {
				options['for']=Ember.computed.alias('_panel._model');						
			}
		}
		mixins.push(options);
		var typeKey=this.typeKey;
		var component = this.extend.apply(this,mixins);
		component.typeKey=typeKey;
		return component;
	}
});