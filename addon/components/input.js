import Ember from 'ember';
import Control from './abstract';

export default Control.extend({
	tagName: 'div',
	
	
	
	_orgValue : null,
	
	isDirty: function() {
		return this.get('value')!=this.get('_orgValue');
	}.property('value'),
	
	layoutName: function() {
		if(!this.get('container')) {
			return null;
		}
		var name="input";
		return name ;
	}.property(),
	
	inputId: null,

	caption : '',
	
	value:null,
	
	init:function() {
		this._super();
		this.reopen({
			property:Ember.computed.alias('_panel.for.'+this.get('_name'))
		});

		this.set('value',this.get('property'));
		this.set('_orgValue',this.get('property'));
		
		this.set('caption',this.get('_panel._modelName')+'.'+this.get('_name'));
		
	},
	
	_syncFromSourceObserver:function(value) {
		if(this.get('_form._syncFromSource')) {
			this.set('value',this.get('property'));
		}
		// If we sync to the source, do not update the _orgValue so we keep a reliable dirty flag
		// If we're not syncing to the source, something else updated it and we should be dirty accordingly, so update _orgValue 
		if(!this.get('_form._syncToSource')) {
			this.set('_orgValue',this.get('property'));
		}
	}.observes('property'),
	
	_syncToSourceObserver:function() {
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
	},
});