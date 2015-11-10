/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Ember from 'ember';


import Controls from './controls';
import Components from './components';
import Inputs from './inputs';

import Helpers from './mixins/helpers';
import Conditional from './mixins/controls/conditional';
import ControlSupport from './mixins/controls/control-support';
import ValueSupport from './mixins/controls/value-support';
import Number from './mixins/controls/number';

/**
 * @class Forms
 * @namespace Furnace
 * @static
 */
export default Ember.Namespace.extend(Helpers, {	
	
	Controls : Controls,
	
	Form : Controls.Form,
	
	Components : Components,

	Inputs : Inputs,
		
	
	Conditional: Conditional,
	
	ControlSupport : ControlSupport,
	
	ValueSupport : ValueSupport,
	
	Number : Number
	
	
}).create();
