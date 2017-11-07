import Forms from 'furnace-forms';

export default Forms.Form.extend({
	
	name: Forms.input(),
	
	employees: Forms.list().item(Forms.form('employee'))
});