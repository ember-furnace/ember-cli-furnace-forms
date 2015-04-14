import Validation from 'furnace-validation';
export default Validation.Object.extend({
	text: Validation.val({
		required:true,
		length:{ min:5,
				max:10},
		whitespace : true,
		trim : true
	})
});