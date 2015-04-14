/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Ember from 'ember';
import Form from './components/form';
import Input from './components/input';
import Panel from './components/panel';
import Condition from './components/condition';
import Action from './inputs/action';
import Submit from './inputs/submit';
import Text from './inputs/text';
import Textarea from './inputs/textarea';
import Password from './inputs/password';
import Select from './inputs/select';
import Helpers from './mixins/helpers';
import Conditional from './mixins/conditional';

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
	
	/**
	 * Action component
	 * @property Action
	 * @type Furnace.Forms.Components.Action
	 */
	Action : Action,

	Submit : Submit,
	
	Panel : Panel,
	
	Condition : Condition,
	
	Text : Text,
	
	Textarea : Textarea,
	
	Password : Password,
	
	Select : Select,
	
	Conditional: Conditional,
	
	
}).create();
