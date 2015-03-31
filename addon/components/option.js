import Input from './abstract';

export default Input.extend({
	value : null,
	
	caption : '',
	
	selected : false,
	
	click : function() {
		console.log('click');
	}
});