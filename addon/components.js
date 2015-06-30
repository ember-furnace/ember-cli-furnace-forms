/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Ember from 'ember';
import Form from './components/form';
import Panel from './components/panel';
import Condition from './components/condition';
import Messages from './components/messages';
import Input from './components/input';
import List from './components/list';
import ListOption from './components/list-option';
import View from './components/view';
/**
 * @class Forms
 * @namespace Furnace
 * @static
 */
export default Ember.Namespace.extend( {	
	/**
	 * Form component
	 * @property Form
	 * @type Furnace.Forms.Components.Form
	 */
	Form : Form,

	Panel : Panel,

	Condition : Condition,
	
	Messages : Messages,
	
	Input : Input,
	
	List : List,
	
	ListOption : ListOption,

	View : View,
	
}).create();
