import Validation from 'furnace-validation';

export default Validation.Object.extend({
	a: Validation.val({
		required: true
	}),
});