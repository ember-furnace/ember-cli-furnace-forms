import Forms from 'furnace-forms';
export default Forms.Form.extend({
	
	foos : Forms.input('acceptance.lists.embedded-updates.foo.list').item(Forms.form('acceptance.lists.embedded-updates.foo')),
	
}).model('test');
