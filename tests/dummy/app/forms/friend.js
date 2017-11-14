import Forms from 'furnace-forms';
export default Forms.Form.extend({
	firstName : Forms.input(),
	
	lastName : Forms.input(),
	
	age: Forms.input().number(),
	
	pets: Forms.list().item(Forms.form('pet')),
	
	gender : Forms.input('select').options(Forms.option('Male','Male'),Forms.option('Female','Female'),Forms.option('Helicopter','Helicopter')),
	
}).model('friend');