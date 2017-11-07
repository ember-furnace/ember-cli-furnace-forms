import Ember from 'ember';

export default Ember.Controller.extend({
	
	store: Ember.inject.service(),
	
	actions: {
		newEmployee() {
			var employee= this.get('store').createRecord('employee',{
				firstName:'David',
				lastName:'Dove',
				friends: [this.get('store').createRecord('person',{
					firstName:'Eddy',
					lastName:'Edison'
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