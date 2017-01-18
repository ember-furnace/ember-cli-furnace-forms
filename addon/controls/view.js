/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Ember from 'ember';
import DS from 'ember-data';
import Control from './abstract';


/**
 * Input control component proxy 
 * 
 * @class Input
 * @namespace Furnace.Forms.Controls
 * @extends Furnace.Forms.Controls.Abstract
 * @protected
 */
export default Control.extend({
	_decoratorName : 'view',
	
	_decoratorType : 'view',
	
	init : function() {
		this._super();
		// If we do not have a name, we're an anonymous option without a counterpart in
		if(this.get('_name')!==null && this.value===undefined) {
			var propertyName='_panel.for.'+this.get('_name');
			
			var property=this.get('_panel._model');
			if(property instanceof DS.ManyArray) {
				this.reopen({
					value: Ember.computed('_panel._model,_panel._model.@each',function() {
						return this.get('_panel._model').objectAt(this._name);
					})
				});
			}
			else {
				this.reopen({
					value:Ember.computed.alias(propertyName)
				});
			}
		}			
	},



	getComponentClass : function() {
		var componentClass=null;
		try {
			componentClass = this._super();
		}
		catch(e){
//			Ember.warn('No view '+this._component+' defined for '+this+' ('+e.message+'), using default');
		}
		if(!componentClass) {
			this._component='view';
			this._componentType='forms';
			return this.getComponentClass();
		}
		return componentClass;
	},
	
});