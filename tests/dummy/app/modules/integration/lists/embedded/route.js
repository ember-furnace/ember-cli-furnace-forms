import Ember from 'ember';
export default Ember.Route.extend({
	store: Ember.inject.service(),
	
	model() {
		return this.get('store').createRecord('company',{
			name :'TestCorp',
			employees : [this.get('store').createRecord('employee',{
				firstName:'Adrian',
				lastName:'Anderson',
				friends: [this.get('store').createRecord('person',{
					firstName:'Brian',
					lastName:'Brooks',
					pets: [this.get('store').createRecord('pet',{
						name:'Felix the cat',
					})]
				})]
			}),
			this.get('store').createRecord('employee',{
				firstName:'Chris',
				lastName:'Cross',
				friends: [this.get('store').createRecord('person',{
					firstName:'David',
					lastName:'Dove',
					pets: [this.get('store').createRecord('pet',{
						name:'Garfield',
					})]
				})]
			})]
		});
	},
	afterModel(model) {
		var a=Ember.A();
		return Ember.RSVP.all(a.getEach.call(Ember.get(model,'employees'),'friends'));
	}
});