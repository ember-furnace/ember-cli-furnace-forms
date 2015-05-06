/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Component from './abstract';
import Ember from 'ember';
import getName from 'furnace-forms/utils/get-name';

/**
 * Panel component
 * 
 * @class Panel
 * @namespace Furnace.Forms.Components
 * @extends Furnace.Forms.Components.Abstract
 */
export default Component.extend({
	tagName : 'panel',
	
	controls : Ember.computed.alias('control.controls'),
	
	inputControls : Ember.computed.alias('control.inputControls'),
	
	actionControls : Ember.computed.alias('control.actionControls'),
});