import Input from './input';
import Ember from 'ember';
export default Input.extend({
	index : Ember.computed.alias('control.index'),
	
	actions : {
//		select: function() {
//			Ember.debug(this.control);
//			console.log(this.get('selected'));
//			this.control.send('select',this.control.index,this.get('selected'));
//			
//		}
	},
	
	selected : Ember.computed.alias('control.selected'),
	
	
});