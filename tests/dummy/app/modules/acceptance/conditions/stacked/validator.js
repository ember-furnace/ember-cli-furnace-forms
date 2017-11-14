import Validation from 'furnace-validation';

export default Validation.Object.extend({
	input1: Validation.val({
		required: true
	}),
	input2: Validation.val({
		required: true
	}),
	input3: Validation.val({
		required: true
	})
});