import Ember from 'ember';

var get=Ember.get;
var set=Ember.set;
export default Ember.Mixin.create({
	
	checked: false,

	inputId:null,
	
	init: function() {
		this._super();
		
		this.on('change', this, this._updateElementValue);
	},

	_updateElementValue: function() {
		 Ember.run.next(this,this._syncWithDom); 
	},
	
	_syncWithDom : function() {
		if(this.$('#'+get(this,'inputId'))) {
			set(this, 'checked', this.$('#'+get(this,'inputId')).prop('checked'));
		}
	},
	
	_checkedObserver: Ember.observer('checked',function() {		
		this.$('#'+Ember.get(this,'inputId')).prop('checked',this.get('checked'));
	}),
	
	didInsertElement : function() {
		this._super();
		Ember.run.next(this, function() {
			var input = this.$('#'+get(this,'inputId'));
			if(input) {
				input.prop('checked',this.get('checked'));
			}
		});
		
		
	}
});