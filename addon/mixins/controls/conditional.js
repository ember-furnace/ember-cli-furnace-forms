import Ember from 'ember';
export default Ember.Mixin.create({
	_condition : false,	
	_conditionFn : null,
	_conditionProps :null,

	init:function() {
		this._super();
		if(typeof this._conditionFn==='function') {
			// Do not schedule this, causes all kinds of syncing issues			
			var fn=function() {				
				this.set('_condition',this._conditionFn());
			};
			(this._conditionProps+(this._isForm===true ? ',_model' : ',_form._model')).split(',').forEach(function(key){
				this.addObserver(key,this,fn);
			},this);
			fn.call(this);
		}
		// We should schedule updateEnabled to make sure it not runs before hasPrerequisites may have updated in the current runloop
		Ember.run.scheduleOnce('sync',this,this._updateEnabled);
	},
	
	hasPrerequisites : Ember.computed.alias('_condition'),

	_updateEnabled:Ember.observer('hasPrerequisites',function() {
		if(this.get('hasPrerequisites')!==false) {
			this.setEnabled(true);					
		} else {
			this.setEnabled(false);			
		}
	}),
	
	conditionProperties: Ember.computed('_conditionProps',{
		get : function() {		
			if(!this._conditionProps) {
				return null;
			}
			return Ember.A(this._conditionProps.split(','));
		}
	}).readOnly().volatile(),
});