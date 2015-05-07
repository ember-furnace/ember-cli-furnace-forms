/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Ember from 'ember';
import Control from './abstract';

/**
 * Input control component
 * 
 * @class Input
 * @namespace Furnace.Forms.Components
 * @extends Furnace.Forms.Components.Abstract
 */
export default Control.extend({
	defaultLayout: 'forms/view',
	
	
	value:Ember.computed.alias('control.value'),
});