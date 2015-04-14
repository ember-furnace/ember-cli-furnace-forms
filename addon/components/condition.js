/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Panel from './panel';
import Ember from 'ember';
import Conditional from 'furnace-forms/mixins/conditional';
/**
 * Conditional panel component
 * 
 * @class Condition
 * @namespace Furnace.Forms.Components
 * @extends Furnace.Forms.Components.Panel
 */
export default Panel.extend(Conditional,{
	
	
//	_rendered : false,
//	isVisible: Ember.computed.alias('_condition'),
	
	value : Ember.computed.alias('_condition'),
	
//	render : function(buffer) {
//		if(this.get('_condition')) {			
//			this._rendered=true;
//			this._super(buffer);
//		} else {
//			this._rendered=false;
//		}
//	},
//	
//	shouldRerender: function() {
//		if(this.get('_condition') && !this._rendered) {
//			this.rerender();
//		}
//		else if(!this.get('_condition') && this._rendered) {
//			this.rerender();
//		}
//	}.observes('_condition')
	
//	layoutName: function() {
//		if(!this.get('container')) {
//			return null;
//		}
//		var name="forms/condition";
//		return name ;
//	}.property(),
});