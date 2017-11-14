import Ember from 'ember';
export default Ember.Route.extend({
	store: Ember.inject.service(),
	
	model() {
		return this.get('store').createRecord('employee',{
			firstName:'Adrian',
			lastName:'Anderson',
			age:30,
			position:null,
			gender:null,
			friends: [this.get('store').createRecord('person',{
				firstName:'Brian',
				lastName:'Brooks',
				age:30,
				gender:null
			}),this.get('store').createRecord('person',{
				firstName:'Chris',
				lastName:'Cross',
				age:30,
				gender:null
			})]
		});
	}
});