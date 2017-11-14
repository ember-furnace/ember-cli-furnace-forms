import Ember from 'ember';
export default Ember.Route.extend({
	store: Ember.inject.service(),
	
	model() {
		return this.get('store').createRecord('person',{
			firstName :'Adrian',
			lastName : 'Anderson'
		});
	}
});