import Panel from './panel';
import Ember from 'ember';

export default Panel.extend({
	_condition : false,	
	
	value : Ember.computed.alias('_condition'),
	
	layoutName: function() {
		if(!this.get('container')) {
			return null;
		}
		var name="condition";
		return name ;
	}.property(),
});