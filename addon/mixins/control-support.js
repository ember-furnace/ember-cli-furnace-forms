import Ember from 'ember';
export default Ember.Mixin.create({
	_controls : null,
	
	_path : null,
	
	init : function() {
		this._super();

		this._controls={};
	},
	
	_dirty : false,
	
	isDirty : false,
	
	setDirty : function(dirty) {
		Ember.run.once(this,function() {
			if(this._dirty!=dirty) {
				this.set('_dirty',dirty);
			}
			dirty=dirty || this.get('controls').filterBy('isDirty', true).get('length')>0;
			if(this.isDirty!=dirty) {
				this.set('isDirty',dirty);
			}
		});
	},
	
	_controlDirtyObserver: Ember.observer('inputControls.@each.isDirty',function(){		
		this.setDirty(this._dirty);
	}),
	
	_valid : null,
	
	isValid : null,
	
	setValid : function(valid) {
		Ember.run.once(this,function() {
			if(this._valid!=valid) {
				this.set('_valid',valid);
			}
			valid= valid!==false && this.get('controls').filterBy('isValid',false ).get('length')===0
			if(valid!=this.isValid) {
				this.set('isValid',valid);
			}
		});
	},
	
	_controlValidObserver: Ember.observer('inputControls.@each.isValid',function(){
		this.setValid(this._valid);
	}),
	
	
	controls: Ember.computed(function() {
		var ret = Ember.A();
		var self = this;
		this.constructor.eachComputedProperty(function(name, meta) {
			if (meta.type==='form-control') {
				ret.pushObject(self.get(name));
			}
		});
		return ret;
	}).readOnly(),
});