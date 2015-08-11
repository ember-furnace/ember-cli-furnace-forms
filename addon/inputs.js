/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Ember from 'ember';
import Text from './inputs/text';
import Number from './inputs/number';
import Password from './inputs/password';
import TextArea from './inputs/textarea';
import Button from './inputs/button';
import Submit from './inputs/submit';
import Select from './inputs/select';
import Checkbox from './inputs/checkbox';
import List from './inputs/list';
import RadioList from './inputs/list/radio';
import RadioOption from './inputs/list/radio-option';
import CheckList from './inputs/list/check';
import CheckOption from './inputs/list/check-option';

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
	Text : Text,

	Number : Number,
	
	Password : Password,

	TextArea : TextArea,
	
	Select : Select,
	
	Checkbox : Checkbox,
	
	List : List,
	
	RadioList : RadioList,
	
	RadioOption : RadioOption,
	
	CheckList : CheckList,
	
	CheckOption : CheckOption,
	
	Button : Button,

	Submit : Submit,
	
	
}).create();
