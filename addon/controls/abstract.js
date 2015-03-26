/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Ember from 'ember';
import Lookup from 'furnace-forms/utils/lookup-class';

/**
 * Abstract control component proxy 
 * 
 * @class Abstract
 * @namespace Furnace.Forms.Controls
 * @extends Ember.ObjectProxy
 * @private
 */
export default Ember.ObjectProxy.extend({
	
	_name: null,
	
	_form: null,
	
	_panel: null,
	
	_component: null,
	
	getComponentClass : function(context,contextName) {
		if(typeof this._component ==="string") {
			return Lookup.call(context,this._component,'input');
		}
		return this._component;
		
	},
	
	extendHash: function(hash) {
		var ret=hash || {};
		var keys=Ember.keys(this);
		for(var key in keys) {
			if(typeof keys[key] ==='string') {
				ret[keys[key]]=this[keys[key]];
			}
		}
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