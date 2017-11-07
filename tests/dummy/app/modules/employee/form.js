import Forms from 'furnace-forms';
import Form from 'dummy/modules/person/form';
export default Form.extend({
	position : Forms.input('select').options(Forms.option('Boss','Boss'),Forms.option('Slave','Slave'))
}).model('employee');