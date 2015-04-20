/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Ember from 'ember';
import Control from './abstract';
import ControlSupport from 'furnace-forms/mixins/control-support';
import I18n from 'furnace-i18n';
/**
 * Input control component proxy 
 * 
 * @class Input
 * @namespace Furnace.Forms.Controls
 * @extends Furnace.Forms.Controls.Abstract
 * @protected
 */
export default Ember.Object.extend(ControlSupport,{
	
	value : null,
	
	selected : false,
	
	caption : I18n.computed(null),
		
	control : null,
	
	input : null,
	
	init: function() {
		if(this.caption instanceof Ember.ComputedProperty && this.get('caption')===null) {
			this.set('caption',this.value);
		}
	},
		
	'for' : Ember.computed.alias('value')
});