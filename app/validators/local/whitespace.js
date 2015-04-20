import Validation from 'furnace-validation';
export default Validation.Property.extend({
	call:function(context,value,result) {
		if(value && value.trim()!=value) {
			if(value.indexOf(' ')===0)
				result.addNotice(context,'whitespaceStart');
			if(value.trim()!=='' && value.lastIndexOf(' ')===value.length-1)
				result.addNotice(context,'whitespaceEnd',[],'blur');
		}
	}
})