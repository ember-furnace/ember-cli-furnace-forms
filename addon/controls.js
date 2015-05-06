/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Ember from 'ember';

import Form from './controls/form';
import Panel from './controls/panel';
import Input from './controls/input';
import Action from './controls/action';
import View from './controls/view';

/**
 * @class Forms
 * @namespace Furnace
 * @static
 */
export default Ember.Namespace.extend( {	
	Form : Form,
	Panel : Panel,
	Input : Input,
	Action : Action,
	View : View,
	
	
}).create();
