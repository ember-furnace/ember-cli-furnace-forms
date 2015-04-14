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
	
	_valid: null,
	
	_enabled: null,
	
	// For additional computed properties on the component
	_extend: null,
	
	getComponentClass : function(context,contextName) {	
		var component=this._component
		if(typeof component ==="string") {
			component = Lookup.call(context,this._component,'input');
		}
		if(this._extend) {
			var typeKey=component.typeKey;
			component= component.extend(this._extend);
			component.typeKey=typeKey;
		}		

		return component;
		
	},
	
	setEnabled : function(enabled) {
		if(this.content)
			this.content.setEnabled(enabled);
		else 
			this._enabled=enabled;
	},
	
	setValid : function(valid) {
		if(this.content)
			this.content.setValid(valid);
		else 
			this._valid=valid;
	},
	
	_contentObserver : function() {
		if(this._valid!==null)
			this.content.setValid(this._valid);
		if(this._enabled!==null)
			this.content.setEnabled(this._enabled);
	}.observes('content'),
	
	getComponent : function(hash) {
		hash=this.extendHash(hash);
		
	},
	
	extendHash: function(hash) {
		var ret=hash || {};
		var keys=Ember.keys(this);
		for(var key in keys) {
			// The toString method has type "string" but should not be copied. Caused one hell of a headache.
			if(typeof keys[key] ==='string' && keys[key]!=='toString') {
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
	},
	
	send: function() { 
		if(this.content) {
			return this.content.send.apply(this.content,arguments);
		}
	}
	
});