import Forms from 'furnace-forms';
export default Forms.Form.extend({
	firstName : Forms.input(),
	
	lastName : Forms.input(),
	
	age: Forms.input().number()
}).model('friend');