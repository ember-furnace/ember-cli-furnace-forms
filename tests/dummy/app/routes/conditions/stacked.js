import Ember from 'ember';
export default Ember.Route.extend({
	model: function() {
		return {
			input1 : 'test1',
			panel1Confirm : true,
			input2 : 'test2',
			panel2Confirm : true,
			input3 : 'test3'
		};
	}
});