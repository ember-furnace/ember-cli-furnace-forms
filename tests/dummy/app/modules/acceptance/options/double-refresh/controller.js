import Ember from 'ember';

export default Ember.Controller.extend({
	
	actions: {
		newModel() {
			var model=this.get('store').createRecord('acceptance.options.double-refresh',{
				
			});
			this.set('model',model);
		}
	}
});