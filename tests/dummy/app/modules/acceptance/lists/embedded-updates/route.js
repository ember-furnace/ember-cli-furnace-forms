import Ember from 'ember';

export default Ember.Route.extend({
	store: Ember.inject.service(),
	
	setupController: function(controller,model) {
		if(!model) {
			model=null;
		}
		model={
			foos:[
				this.get('store').createRecord('acceptance.lists.embedded-updates.foo',{
					value:1,
					bars:[
						this.get('store').createRecord('acceptance.lists.embedded-updates.bar')
					]
				}),
				this.get('store').createRecord('acceptance.lists.embedded-updates.foo',{
					value:1,
					bars:[
						this.get('store').createRecord('acceptance.lists.embedded-updates.bar')
					]
				})],
		};
		this._super(controller,model);
	}
	
});