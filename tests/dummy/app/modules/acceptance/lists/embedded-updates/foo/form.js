import Forms from 'furnace-forms';

export default Forms.Form.extend({	

	bars : Forms.list().item(Forms.form('acceptance.lists.embedded-updates.bar'))
	
}).model('foo');