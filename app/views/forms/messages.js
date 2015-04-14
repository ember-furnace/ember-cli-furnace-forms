import Ember from 'ember';
export default Ember.View.extend({
	tagName : 'messages',
	templateName: 'forms/messages',
		
	classNameBindings: ['showClass'],
	
	showClass : Ember.computed('show',function() {
		if(this.show) {
			return 'visible';
		}
		return 'hidden';
	})
	
});