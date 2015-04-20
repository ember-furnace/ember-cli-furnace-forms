import Ember from 'ember';

export default Ember.Mixin.create({
	
	_options : Ember.computed(function(key,value){
		if(value) {
			var ret=Ember.A();
			var input=this;
			value.forEach(function(option) {
				ret.pushObject(option.create({input:input}));
			});
			return ret;
		}
		return Ember.A();
	}),
	
	_optionFn : null,
	
	isLoading : false,
	
	
	init : function() {
		this._super();
		if(this._optionFn) {			
			this.reopen({
				_options: Ember.computed(function(key,value) {
					if(value===undefined) {
						value = this._optionFn();
					}
					if(value instanceof Ember.RSVP.Promise) {
						var _self=this;
						value.then(function(options){
							_self.set(key,options);
						});
						return Ember.A();
					}
					if(value) {
						var ret=Ember.A();
						var input=this;
						value.forEach(function(option) {
							ret.pushObject(option.create({input: input}));
						});
						return ret;
					}
					return Ember.A();
				})
			});
		}
		this._optionsObserver();
	},
	
	getOption: function(index) {
		if(index===undefined) {
			index=this.get('selectedIndex')-1;
		}
		return this.get('_options')[index];			
	},
	
	selectedOption : Ember.computed(function(key,value) {
		if(value) {
			this.set('value',value.get('value'));
		}
		return this.getOption();
	}),
	
	selectedIndex : Ember.computed('value,options',function(key,value) {
		if(value===null) {
			this.set('value',null);
			return 0;
		}
		if(value) {
			this.set('value',this.get('_options')[value-1].value);
			return value;
		}
		else {
			if(this.get('_options')) {
				var option = this.get('_options').findBy('value',this.get('value'));
				return this.get('_options').indexOf(option)+1;
			}
		}
		return 0;
	}),
	
	options : Ember.A(), 
		
	_optionsObserver: function() {
		var options=[];
		var _options=this.get('_options');
		_options.forEach(function(option,index) {			
			options.push({index: index+1, caption: option.get('caption')});
		});
		this.set('options',options);
	}.observes('_options'),
});