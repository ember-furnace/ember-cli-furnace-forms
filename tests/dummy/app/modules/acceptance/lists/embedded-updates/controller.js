import Ember from 'ember';

export default Ember.Controller.extend({
	
	isDirty: false,

	actions: {
		newModel() {
			var model={
				foos:[
					this.get('store').createRecord('acceptance.lists.embedded-updates.foo',{
						value:1,
						bars:[
							this.get('store').createRecord('acceptance.lists.embedded-updates.bar')
						]
					})],
			};
			this.set('model',model);
		}
	}
});