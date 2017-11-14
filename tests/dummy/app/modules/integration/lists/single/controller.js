import Ember from 'ember';

export default Ember.Controller.extend({
	
	store: Ember.inject.service(),
	
	actions: {
		newEmployee() {
			var employee= this.get('store').createRecord('employee',{
				firstName:'David',
				lastName:'Dove',
				age: 20,
				position:null,
				gender:null,
				friends: [this.get('store').createRecord('person',{
					firstName:'Eddy',
					lastName:'Edison',
					age:35,
					gender:null
				})]
			});
			this.set('employee',employee);
		}
	},
	
	employee: Ember.computed({
		get() {
			return this.get('model');
		}
	})
});