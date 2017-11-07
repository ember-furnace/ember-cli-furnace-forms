import Ember from 'ember';

export default Ember.Controller.extend({
	
	store: Ember.inject.service(),
	
	actions: {
		newCompany() {
			var company= this.get('store').createRecord('company',{
				name :'NewTestCorp',
				employees : [this.get('store').createRecord('employee',{
					firstName:'David',
					lastName:'Dove'
				})]
			});
			this.set('company',company);
		}
	},
	
	company: Ember.computed({
		get() {
			return this.get('model');
		}
	})
});