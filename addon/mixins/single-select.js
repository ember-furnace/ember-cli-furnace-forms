import Ember from 'ember';
export default Ember.Mixin.create({
	control : null,
	
	showControl : false,
	
	_selectedIndexObserver:Ember.observer('selectedIndex', function() {
		var option = this.getOption();
		if(option && option.control) {
			this.set('control', Ember.get(option,'control'));
			this.set('showControl',true);
		} else {
			this.set('showControl',false);
			this.set('control',null);
		}
	}),
	
	init: function() {
		this._super();
		this._selectedIndexObserver();
	},
	
	setValid:function(valid) {
		if(this.control && valid && this.get('control.isValid')===false) {
			this.control.send('validate');
			return this._super(false);
		}
		return this._super(valid);		
	},
	
	_controlValidObserver : function() {
		Ember.run.once(this,function(){			
			this.setValid(this.get('control.isValid'));
		});
	}.observes('control,control.isValid'),
		
});