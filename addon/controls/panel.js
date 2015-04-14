/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Control from './abstract';
import Component from 'furnace-forms/components/panel';
import Ember from 'ember';
import Lookup from 'furnace-forms/utils/lookup-class';
/**
 * Panel control component proxy 
 * 
 * @class Panel
 * @namespace Furnace.Forms.Controls
 * @extends Furnace.Forms.Controls.Abstract
 * @protected
 */
export default Control.extend({
	_component : Component,
		

}).reopenClass({
	
	generate : function(options) {
		var extend=options || {};	
		if(options._panel['for'].get(options._name)) {
			extend['for']=Ember.computed.alias('_panel.for.'+options._name);
		} else {
			extend['for']=Ember.computed.alias('_panel.for');						
		}		
		var _options={
			_extend : extend,
			_name: options._name,
			_panel: options._panel,
			_form: options._form,
			_component:options._component,
		};
		return this.create(_options);
	}
});