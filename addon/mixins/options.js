import Ember from 'ember';

export default Ember.Mixin.create({
	
	_options : Ember.A(),
	
	_optionFn : null,
	
	init : function() {
		this._super();
		if(this._optionFn) {
			this.reopen({
				_options: Ember.computed(this._optionFn)
			});
		}
	},

	
	selectedIndex : Ember.computed(function(key,value) {
		if(value) {
			this.set('value',this._options[value-1]);
			return value;
		}
		else {
			if(this.get('_options')) {
				var option = this.get('_options').findBy('value',this.get('value'));
				return this.get('_options').indexOf(option)+1;
			}
		}
	}).property('value'),
	
	options : Ember.computed(function(){
		var options=[];
		this.get('_options').forEach(function(option,index) {
			options.push({index: index+1, caption: option.caption});
		});
		return options;
	}).property('_options'),
});