/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Ember from 'ember';
import Control from './abstract';

/**
 * Input control component
 * 
 * @class Input
 * @namespace Furnace.Forms.Components
 * @extends Furnace.Forms.Components.Abstract
 */
export default Control.extend({
	
	actions: {
		focus:function() {
			this.set('_focus',true);
		},
		
		blur:function() {
			this.set('_focus',false);
		},
		
	},
	
	_orgValue : null,
	
	isDirty: function() {
		return this.get('value')!=this.get('_orgValue');
	}.property('value'),
	
	layoutName: function() {
		if(!this.get('container')) {
			return null;
		}
		if(this.constructor.typeKey)
			return this.constructor.typeKey.replace(/\./g,'/')+'/input';
		return 'forms/input' ;
	}.property(),
	
	inputId: null,

	caption : null,
	
	value:null,
	
	_focus:false,
	
	hasFocus:Ember.computed.alias('_focus'),
	
	init:function() {
		this._super();
		
		this.reopen({
			property:Ember.computed.alias('_panel.for.'+this.get('_name'))
		});

		this.set('value',this.get('property'));
		this.set('_orgValue',this.get('property'));
		
		if(this.get('caption')===null) {
			var name=this.get('_panel._modelName')+'.'+this.get('_name');
			this.set('caption',name);
			
		}
	},
	
	_propertyObserver:function(value) {
		if(this.get('_form._syncFromSource')) {
			this.set('value',this.get('property'));
		}
		// If we sync to the source, do not update the _orgValue so we keep a reliable dirty flag
		// If we're not syncing to the source, something else updated it and we should be dirty accordingly, so update _orgValue 
		if(!this.get('_form._syncToSource')) {
			this.set('_orgValue',this.get('property'));
		}
	}.observes('property'),
	
	_valueObserver:function() {		
		if(this.get('_form._syncToSource')) {
			this._apply();
		}
	}.observes('value'),
	
	_apply: function() {
		this.set('property',this.get('value'));
	},
	
	_reset: function() {
		this.set('value',this.get('_orgValue'));
	},
	
	inputInsert:function() {
		this.set('targetObject.inputId',this.elementId);
	}
	
	
	
	
});