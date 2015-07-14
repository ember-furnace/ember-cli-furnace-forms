/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Ember from 'ember';
import Control from './abstract';
import Lookup from 'furnace-forms/utils/lookup-class';
import ValueSupport from 'furnace-forms/mixins/controls/value-support';
/**
 * Input control component proxy 
 * 
 * @class Input
 * @namespace Furnace.Forms.Controls
 * @extends Furnace.Forms.Controls.Abstract
 * @protected
 */
export default Control.extend(ValueSupport,{
	_component : 'text',
	
	_componentType : 'input',
	
	
	init:function() {
		this._super();
		
		
		
	},
	
	
	
});