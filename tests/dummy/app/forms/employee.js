import Forms from 'furnace-forms';
import Form from './person';
export default Form.extend({
	position : Forms.input('select').options(Forms.option('Boss','Boss'),Forms.option('Slave','Slave'))
}).model('employee');