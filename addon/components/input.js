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
	
	attributeBindings: ['type'],
	
	_orgValue : null,
	
	defaultLayout: 'forms/input',
	
	property: null,
	
	inputId: null,

	value:null,

	init:function() {
		this._super();
		// If we do not have a name, we're an anonymous option without a counterpart in 
		if(this.get('_name')) {
			Ember.warn("No attribute in target model for input "+this._name+" (path "+this._path+")",this.get('_panel.for.'+this.get('_name'))!==undefined);
			if(this.get('_panel.for.'+this.get('_name'))!==undefined) {
				this.reopen({
					property:Ember.computed.alias('_panel.for.'+this.get('_name'))
				});
				
				this.set('value',this.get('property'));
				this.set('_orgValue',this.get('property'));
			}
			else {
				this.set('_orgValue',this.get('value'));
			}
		}
		
		if(!this.get('_panel.isEnabled')) {
			this.setEnabled(false);
		}
		
	},
	
	_propertyObserver:function(value) {
		if(this.get('_name') && this.get('_form._syncFromSource')) {
			this.set('value',this.get('property'));
		}
		// If we sync to the source, do not update the _orgValue so we keep a reliable dirty flag
		// If we're not syncing to the source, something else updated it and we should be dirty accordingly, so update _orgValue 
		if(!this.get('_form._syncToSource')) {
			this.set('_orgValue',this.get('property'));
		}
		this.setDirty(this.get('value')!==this.get('_orgValue'));
	}.observes('property'),
	
	
	_valueObserver:function() {
		if(this.get('_name') && this.get('_form._syncToSource')) {
			this._apply();
		}
		this.setDirty(this.get('value')!==this.get('_orgValue'));
		this._panel.propertyDidChange(this._name);
	}.observes('value'),
	
	_apply: function() {
		if(this.property!==null) {
			Ember.run.once(this,function(){
				if(this.get('_panel.for')) {
					this.set('property',this.get('value'));
				}
			});
		}
	},
	
	_reset: function() {
		this.set('value',this.get('_orgValue'));
	},
	
	inputInsert:function() {
		this.set('targetObject.inputId',this.elementId);
	},
	
	disabledAttr:function() {
		return this.get('isEnabled') ? null : 'disabled';
	}.property('isEnabled'),

	
	type : Ember.computed(function() {
		return Ember.String.camelize(this.constructor.typeKey);
	}),
});