import Ember from 'ember';

var get=Ember.get;
var set=Ember.set;
export default Ember.Mixin.create({
	
	checked: false,

	inputId:null,
	
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
	},
	
	click : function(event) {
		var target=event.target;
		if(target.id===this.get('inputId')) {
			this.control.select();
		}
	},
});