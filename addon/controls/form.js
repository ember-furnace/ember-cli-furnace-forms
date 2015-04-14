/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Control from './abstract';
import Component from 'furnace-forms/components/form';
import Lookup from 'furnace-forms/utils/lookup-class';
/**
 * Form control component proxy 
 * 
 * @class Form
 * @namespace Furnace.Forms.Controls
 * @extends Furnace.Forms.Controls.Abstract
 * @protected
 */
export default Control.extend({
	_component: null,
	_options:null,

	getComponentClass : function(context,contextName) {
		if(typeof this._component ==="string") {
			return Lookup.call(context,this._component,'form');
		}
		return this._component;
		
	},
	
	extendHash : function(hash) {
		hash= this._super(hash);
		for(var name in this._options) {
			if(hash[name]===undefined) {
				hash[name]=this._options[name];
			}
		}
		return hash;
	}
	
}).reopenClass({
	

	
	generate : function(options) {
		options=options || {};	
		if(options._panel['for'].get(options._name)) {
			options['for']=Ember.computed.alias('_panel.for.'+options._name);
		} else {
			options['for']=Ember.computed.alias('_panel.for');
		}
		var _options={
			_options : options,
			_name: options._name,
			_panel: options._panel,
			_form: options._form,
			_component:options._component,
		};
		return this.extend(_options).create();
	}
});