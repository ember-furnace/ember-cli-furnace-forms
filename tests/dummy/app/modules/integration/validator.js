import Validation from 'furnace-validation';

export default Validation.Object.extend({
	text: Validation.val({
		required: true
	})
});