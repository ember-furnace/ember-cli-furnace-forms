import Ember from 'ember';
import Control from 'furnace-forms/controls/abstract';

export default Ember.Component.extend({
	tagName: 'control',
	
	isValid: null,
	
	classNameBindings: ['_name','_controlClasses'],
	
	_controlClasses : function() {
		var classes=[];
		if(this.get('controlErrors').length) {
			classes.push('error');
		} 
		if(this.get('controlWarnings').length) {
			classes.push('warning');
		}
		if(this.get('controlNotices').length) {
			classes.push('notice');
		}		
		return classes.join(" ");
	}.property('controlMessages'),
	
	controlMessages: function() {
		if(!this._form || !this._form.get('_messages')){
			return Ember.A();
		}
		return this._form.get('_messages').filterBy('path',this.get('_form._modelName')+'.'+this._path);
	}.property('_form._messages'),
	
	controlErrors: function() {
		return this.get('controlMessages').filterBy('type','error');
	}.property('controlMessages'),
	
	controlWarnings: function() {
		return this.get('controlMessages').filterBy('type','warning');
	}.property('controlMessages'),
	
	controlNotices: function() {
		return this.get('controlMessages').filterBy('type','notices');
	}.property('controlMessages'),
	
	_name : null,
	
	_form : null,
	
	_panel : null,
	
	_path : null,
	
	init:function() {
		this._super();		
		this.set('target',this.get('targetObject'));
		if(this.get('targetObject.'+this._name) instanceof Control) {
			this.set('targetObject.'+this._name+'.content',this);
		}
		if(this._form) {
			this.set('_path',(this.get('_panel._path') ? this.get('_panel._path')+ "." : '')+this.get('_name'));
		}
	},
	
	layoutName: function() {
		if(!this.get('container')) {
			return null;
		}
		var name=this.get('tagName');
		return name ;
	}.property(),
	
	_apply: function() {

	},
	
	_reset: function() {
		
	},
	
});