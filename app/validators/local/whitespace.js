import Validation from 'furnace-validation';
export default Validation.Property.extend({
	call:function(context,value,result) {
		if(value && value.trim()!=value) {
			result.addNotice(context,'whitespace');
		}
	}
})