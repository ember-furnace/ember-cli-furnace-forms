import Ember from 'ember';
import Form from './components/form';
import Input from './components/input';
import Helpers from './mixins/helpers';

export default Ember.Namespace.extend(Helpers, {		
	Form : Form,
	Input : Input,
	
}).create();
