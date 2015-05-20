/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Ember from 'ember';
import Text from './inputs/text';
import Password from './inputs/password';
import TextArea from './inputs/textarea';
import Button from './inputs/button';
import Submit from './inputs/submit';
import Select from './inputs/select';
import Checkbox from './inputs/checkbox';
import RadioList from './inputs/list/radio';
import RadioOption from './inputs/list/radio-option';

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
	
	Password : Password,

	TextArea : TextArea,
	
	Select : Select,
	
	Checkbox : Checkbox,
	
	RadioList : RadioList,
	
	RadioOption : RadioOption,
	
	Button : Button,

	Submit : Submit,
	
	
}).create();
