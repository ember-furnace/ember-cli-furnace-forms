/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Ember from 'ember';
import Control from 'furnace-forms/components/input';

/**
 * Text input control component
 * 
 * @class Text
 * @namespace Furnace.Forms.Components
 * @extends Furnace.Forms.Components.Input
 */
export default Control.extend({
	layoutName: function() {		
		if(this.constructor.typeKey!=='text')
			return this._super();
		return 'forms/text/input' ;
	}.property(),
});