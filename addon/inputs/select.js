/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Ember from 'ember';
import Input from 'furnace-forms/components/input';

import Options from 'furnace-forms/mixins/options';

/**
 * Text input control component
 * 
 * @class Radio
 * @namespace Furnace.Forms.Components
 * @extends Furnace.Forms.Components.Input
 */
export default Input.extend(Options,{
	
		
	layoutName: function() {		
		if(this.constructor.typeKey!=='select')
			return this._super();
		return 'forms/select/input' ;
	}.property(),
});