import Ember from 'ember';

export default Ember.Mixin.create({
	
	format : null,
	
	step :1,
	min : null,
	max : null,
	real : null,
	
	precision : 0,
	
	
	actions : {
		stepUp : function() {
			this.set('value',this.get('value')+this.get('step'));
		},
		stepDown : function() {
			this.set('value',this.get('value')-this.get('step'));
		}
	},
	
	_valueObserver : Ember.observer('value',function() {
		this._super();
		var value=this.get('value');
		if(isNaN(value)) {
			if(this.get('min')!==null) {
				this.set('value',this.get('min'));
			} else {
				this.set('value',0);
			}
			return;
		}
		if(this.get('min')!==null && value<this.get('min')) {
			this.set('value',this.get('min'));				
		}
		if(this.get('max')!==null && value>this.get('max')) {
			this.set('value',this.get('max'));				
		}
		switch(this.get('real')) {
			case true:
				if(this.value<0) {
					this.set('value',0);
				}
				break;
			case false:
				if(this.value>0) {
					this.set('value',0);
				}
				break;
		}
		
	}),
});