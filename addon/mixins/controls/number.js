import Ember from 'ember';

export default Ember.Mixin.create({
	
	format : null,
	
	step :1,
	min : null,
	max : null,
	real : null,
	
	precision : 0,
	
	canBeNull: false,
	
	actions : {
		stepUp : function() {
			this.set('value',this.get('value')+this.get('step'));
		},
		stepDown : function() {
			this.set('value',this.get('value')-this.get('step'));
		}
	},
	
	init : function() {
		this._super();
		if(!this._checkValue()) {			
			this._valueObserver();
		}
	},
	
	_checkValue: function() {
		var value=this.get('value');
		if(value===null && this.canBeNull) {
			return true;
		}
		if(typeof value!=='number') {
			value=Number(value);
			if(isNaN(value)) {
				if(this.canBeNull) {
					value=null;
				} else {
					value = this.get('min')!==null ? this.get('min') : 0;
				}
			}
			this.set('value',value);
			return false;
		}
		if(this.get('min')!==null && value<this.get('min')) {
			this.set('value',this.get('min'));
			return false;
		}
		if(this.get('max')!==null && value>this.get('max')) {
			this.set('value',this.get('max'));
			return false;
		}
		switch(this.get('real')) {
			case true:
				if(this.value<0) {
					this.set('value',0);
					return false;
				}
				break;
			case false:
				if(this.value>0) {
					this.set('value',0);
					return false;
				}
				break;
		}
		return true;
	},
	
	value: Ember.computed({
		set: function(key,value) {			
			if(typeof value!=='number') {
				if(value===null && !this.canBeNull) {
					value=0;
				} else if(value==='' && this.canBeNull) {
					value=null;
				} else {
					value=Number(value);
					if(this.get('min')!==null && value<this.get('min')) {
						return this.get('min');
					}
					if(this.get('max')!==null && value>this.get('max')) {
						return this.get('max');
					}
					switch(this.get('real')) {
						case true:
							if(this.value<0) {
								return 0;
							}
							break;
						case false:
							if(this.value>0) {
								return 0;
							}
							break;
					}
				}
			}
			return value;
		}
	}),
	
	_constraintObserver : Ember.observer('min,max,real',function() {
		this._checkValue();
	}),
	
	_valueObserver : Ember.observer('value',function() {
		this._checkValue();
		this._super();				
	}),
});