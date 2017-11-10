import Forms from 'furnace-forms';
export default Forms.Form.extend({
	firstName : Forms.input(),
	
	lastName : Forms.input(),
	
	age: Forms.input().number(),
	
	pets: Forms.list().item(Forms.form('pet')),
	
}).model('friend');