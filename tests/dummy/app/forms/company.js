import Forms from 'furnace-forms';

export default Forms.Form.extend({
	
	name: Forms.input(),
	
	employees: Forms.input('employees',{sortProperties: ['for.lastName']}).item(Forms.form('employee'))
}).model('company');