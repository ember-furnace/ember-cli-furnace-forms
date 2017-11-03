import Ember from 'ember';
export default Ember.Route.extend({
	store: Ember.inject.service(),
	
	actions: {
		finish() {
			this.refresh();
		}
	},
	
	model() {
		return this.get('store').createRecord('conditions.stacked');
	}
});