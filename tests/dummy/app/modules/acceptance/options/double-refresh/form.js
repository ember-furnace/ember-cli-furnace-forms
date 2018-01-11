import Forms from 'furnace-forms';

export default Forms.Form.extend({
	
	test : Forms.input('radio').options(function(options,oldOptions) {
		if(!oldOptions.length) {
			options.pushObject(Forms.option('a','a'));
			options.pushObject(Forms.option('b','b'));
			return options;
		}
	}).single(),
	
	testPanel: Forms.panel('condition',{
		test2 : Forms.input('acceptance.options.double-refresh'),
	}).on('test',function() {
		return true;
	}),
	
});