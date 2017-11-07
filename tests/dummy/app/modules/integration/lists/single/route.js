import Ember from 'ember';
export default Ember.Route.extend({
	store: Ember.inject.service(),
	
	model() {
		return this.get('store').createRecord('employee',{
			firstName:'Adrian',
			lastName:'Anderson',
			friends: [this.get('store').createRecord('person',{
				firstName:'Brian',
				lastName:'Brooks'
			}),this.get('store').createRecord('person',{
				firstName:'Chris',
				lastName:'Cross'
			})]
		});
	}
});