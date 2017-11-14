import Ember from 'ember';

export default Ember.Controller.extend({
	
	store: Ember.inject.service(),
	
	actions: {
		newCompany() {
			var company= this.get('store').createRecord('company',{
				name :'NewTestCorp',
				employees : [this.get('store').createRecord('employee',{
					firstName:'Eddy',
					lastName:'Edison',
					friends: [this.get('store').createRecord('person',{
						firstName:'Ferdinand',
						lastName:'Ferrel',
					})]
				})]
			});
			this.set('model',company);
		},
		fakeCompany() {
			var company= {
				name :'NewTestCorp',
				employees : [this.get('store').createRecord('employee',{
					firstName:'Eddy',
					lastName:'Edison',
					friends: [this.get('store').createRecord('person',{
						firstName:'Ferdinand',
						lastName:'Ferrel',
						pets: [this.get('store').createRecord('pet',{
							name:'Bugs Bunny',
						})]
					})]
				})]
			};
			this.set('model',company);
		}
	}
});