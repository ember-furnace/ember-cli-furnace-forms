import Ember from 'ember';
export default Ember.Mixin.create({
	_condition : false,	
	_conditionFn : null,
	_conditionProps :null,

	init:function() {
		this._super();
		if(typeof this._conditionFn==='function') {
			// Do not schedule this, causes all kinds of syncing issues
			this.reopen({
				_conditionObserver:Ember.observer(this._conditionProps+',_form._model',function() {
					this.set('_condition',this._conditionFn());
				}).on('init')
			});
			
			
		}
	},
	
	hasPrerequisites : Ember.computed.alias('_condition'),

	conditionProperties: Ember.computed('_conditionProps',{
		get : function() {		
			if(!this._conditionProps) {
				return null;
			}
			return Ember.A(this._conditionProps.split(','));
		}
	}).readOnly().volatile(),
});