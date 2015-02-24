import Panel from './panel';

export default Panel.extend({
	_condition : false,	
	
	layoutName: function() {
		if(!this.get('container')) {
			return null;
		}
		var name="condition";
		return name ;
	}.property(),
});