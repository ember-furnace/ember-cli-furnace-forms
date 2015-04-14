import Ember from 'ember';
export default Ember.Mixin.create({
	_condition : false,	
	_conditionFn : null,
	_conditionProps :null,
	
	init:function() {
		this._super();
		if(typeof this._conditionFn==='function') {
			this.reopen({
				_condition:Ember.computed(this._conditionProps,this._conditionFn)
			});
		}
	},
	
	hasPrerequisites : Ember.computed.alias('_condition')

	
});