/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Ember from 'ember';
import Form from './components/form';
import Input from './components/input';
import Helpers from './mixins/helpers';
/**
 * @class Forms
 * @namespace Furnace
 * @static
 */
export default Ember.Namespace.extend(Helpers, {	
	/**
	 * Form component
	 * @property Form
	 * @type Furnace.Forms.Components.Form
	 */
	Form : Form,
	
	/**
	 * Input component
	 * @property Input
	 * @type Furnace.Forms.Components.Input
	 */
	Input : Input,
	
}).create();
