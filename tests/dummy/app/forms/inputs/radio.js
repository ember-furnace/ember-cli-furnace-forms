import Forms from 'furnace-forms';
export default Forms.form({
	text : Forms.input('radio').options(Forms.option(1,'1'),Forms.option(2,'2'),Forms.option(3,'3'))
})