import Ember from 'ember';
import Form from './components/form';
import Helpers from './mixins/helpers';

export default Ember.Namespace.extend(Helpers, {		
	Form : Form,
	
	
}).create();
