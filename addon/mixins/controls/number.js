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
		this._checkValue(true);
		this._valueObserver();			
	},
	
	_checkValue: function(fix) {
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
		if(fix) {
			var value=this.get('value');
			if(value!==null) {
				var newValue=value;
				if(this.precision===0) {
					newValue=parseInt(value)
				} else {
					newValue=parseFloat(value);
				}
				if(newValue!==value) {
					this.set('value',newValue);
				}
			}
		}
		return true;
	},
	
	
	_constraintObserver : Ember.observer('min,max,real',function() {
		this._checkValue(true);
	}),
	
	_valueObserver : Ember.observer('value',function() {
		if(this._checkValue()) {
			this._super();
		}
	}),
});