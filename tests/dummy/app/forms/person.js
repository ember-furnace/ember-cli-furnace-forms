import Forms from 'furnace-forms';

export default Forms.Form.extend({
	firstName : Forms.input(),
	
	lastName : Forms.input(),
	
	age: Forms.input().number(),
	
	bestFriend: Forms.input(),
	
	friends: Forms.list().item(Forms.form('friend')),
	
	pets: Forms.list().item(Forms.form('pet')),
	
	address: Forms.input()
	
}).model('person');