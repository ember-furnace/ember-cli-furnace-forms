import Ember from 'ember';

export default Ember.Mixin.create({
	
	format : null,
	
	step :1,
	min : null,
	max : null,
	real : null,
	
	precision : null,
	
	canBeNull: false,
	
	actions : {
		stepUp : function() {
			this.set('value',this.get('value')+this.get('step'));
		},
		stepDown : function() {
			this.set('value',this.get('value')-this.get('step'));
		},
		onBlur: function() {
			this._checkValue(true);
			this._super();
		}
	},
	
	init : function() {
		this._super();
		// Do not trigger a value update during initialization but schedule instead
		// Otherwise several observers will not trigger .eg dirty observers
		Ember.run.schedule('sync',this,this._checkValue,true);
	},
	
	_checkValue: function(fix) {
		var value=this.get('value');
		if(value===null) {
			if(this.canBeNull) {
				return true;
			} else {
				value = this.get('min')!==null ? this.get('min') : 0;
				if(fix) {					
					this.set('value',value);
				}
				return false;
			}
		}		
		if(typeof value!=='number' || isNaN(value)) {
			value=Number(value);
			if(isNaN(value)) {
				if(this.canBeNull) {
					value=null;
				} else {
					value = this.get('min')!==null ? this.get('min') : 0;
				}
				if(fix) {					
					this.set('value',value);
				}
				return false;
			}						
		}
		if(this.get('min')!==null && value<this.get('min')) {
			if(fix) {
				this.set('value',this.get('min'));
			}
			return false;
		}
		if(this.get('max')!==null && value>this.get('max')) {
			if(fix) {
				this.set('value',this.get('max'));
			}
			return false;
		}
		switch(this.get('real')) {
			case true:
				if(this.value<0) {
					if(fix) {
						this.set('value',0);
					}
					return false;
				}
				break;
			case false:
				if(this.value>0) {
					if(fix) {
						this.set('value',0);
					}
					return false;
				}
				break;
		}
		if(value!==null) {
			var newValue=value;
			if(this.precision===0) {
				newValue=parseInt(value);
			} else {
				newValue=parseFloat(value);
				if(this.precision>0) {
					newValue=parseFloat(newValue.toFixed(this.precision));					
				}
			}
			if(newValue!==value) {
				if(fix) {
					this.set('value',newValue);					
				}
				return false;
			}
		}
		
		return true;
	},
	
	
	_constraintObserver : Ember.observer('min,max,real',function() {
		this._checkValue(true);
	}),
	
	_valueObserver : function() {
		if(this._checkValue()) {
			this._super();
		} else {
			var hasFocus=this._components.filterBy('hasFocus',true).length>0;
			if(!hasFocus) {
				this._checkValue(true);
			}
		}
	},
});