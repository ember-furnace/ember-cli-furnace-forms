/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Ember from 'ember';
import Control from './input';
import ControlSupport from 'furnace-forms/mixins/controls/control-support';
import OptionsSupport from 'furnace-forms/mixins/controls/options-support';

import options from 'furnace-forms/utils/options';

/**
 * Control with options 
 * 
 * @class Options
 * @namespace Furnace.Forms.Controls
 * @extends Furnace.Forms.Controls.Input
 * @protected
 */
export default Control.extend(ControlSupport,OptionsSupport).reopenClass({
	options:options
})