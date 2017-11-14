import Validation from 'furnace-validation';
import Person from 'dummy/models/person';
export default Validation.Object.extend( {
	
	name: Validation.val('required'),
	
	owner: Validation.val({
		object: { typeCheck: Person },
		required: true,
	})
	
});