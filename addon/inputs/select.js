/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Ember from 'ember';
import Input from 'furnace-forms/components/input';
import Placeholder from 'furnace-forms/mixins/placeholder';

import Options from 'furnace-forms/mixins/options';
import SingleSelect from 'furnace-forms/mixins/single-select';
import getName from 'furnace-forms/utils/get-name';
import InputControl from 'furnace-forms/controls/input';
/**
 * Text input control component
 * 
 * @class Radio
 * @namespace Furnace.Forms.Components
 * @extends Furnace.Forms.Components.Input
 */
export default Input.extend(Options,SingleSelect,Placeholder,{
	
	defaultLayout: 'forms/select',
	
});