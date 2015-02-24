import Ember from 'ember';

export default Ember.ObjectProxy.extend({
	
	_name: null,
	
	_form: null,
	
	_panel: null,
	
	_component: null,
	
	extendHash: function(hash) {
		var ret=hash || {};
		ret._name=this._name;
		ret._form=this._form;
		ret._panel=this._panel;
		return ret;
	},

	_apply : function() {
		if(this.content) {
			return this.content._apply();
		}
	},
	
	_reset : function() {
		if(this.content) {
			return this.content._reset();
		}
	}
});