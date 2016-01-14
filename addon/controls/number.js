/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Ember from 'ember';
import Control from './input';
import NumberMixin from 'furnace-forms/mixins/controls/number';

/**
 * Number Control 
 * 
 * @class Number
 * @namespace Furnace.Forms.Controls
 * @extends Furnace.Forms.Controls.Input
 * @protected
 */
export default Control.extend(NumberMixin);