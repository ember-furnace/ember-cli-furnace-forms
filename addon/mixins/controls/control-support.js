import Ember from 'ember';
import Action from 'furnace-forms/controls/action';
export default Ember.Mixin.create({
	_controls : null,
	
//	_path : null,
	
	_controlPromise : null,
	
	
	init : function() {
		this._super();
		// "for" or "value" might not be available yet
		if(!this.get('for')) {
			Ember.run.later(this,this._loadControls);
		} else {
			this._loadControls();
		}
	},
	
	controls: Ember.computed('_controls',function() {
		if(this._controls===null) {
			return Ember.A();
		}
		return this._controls;
	}).readOnly(),
	
	_loadControls : function() {
		var control=this;
		var controls=Ember.A();
		if(this.isDestroyed) {
			return;
		}
		control.constructor.eachComputedProperty(function(name, meta) {		
			if (meta.type==='form-control') {
				controls.pushObject(control.get(name));
			}
		});		
		if(this.isDestroyed) {
			return;
		}
		this.set('_controls',controls);
	},
	
	inputControls: Ember.computed('_controls',function() {
	    var ret = Ember.A();
	    if(this._controls===null) {
	    	return ret;
	    }
	    var self = this;
	    this.constructor.eachComputedProperty(function(name, meta) {
			if (meta.type==='form-control' && !(self.get(name) instanceof Action)) {
				ret.pushObject(self.get(name));
			}
	    });
		return ret;
	}).readOnly(),
	
	actionControls: Ember.computed('_controls',function() {
		var ret = Ember.A();
		if(this._controls===null) {
	    	return ret;
		}
		var self = this;
		this.constructor.eachComputedProperty(function(name, meta) {
			if (meta.type==='form-control' && (self.get(name) instanceof Action)) {
				ret.pushObject(self.get(name));
			}
		});
		return ret;
	}).readOnly(),
	
//	_dirty : false,
//	
//	isDirty : false,
	
	setDirty : function(dirty) {
		Ember.run.scheduleOnce('sync',this,function() {
			if(this._dirty!==dirty) {
				this.set('_dirty',dirty);
			}
			dirty=dirty || this.get('controls').filterBy('isDirty', true).get('length')>0;
			if(this.isDirty!==dirty) {
				this.setFlag('isDirty',dirty);
			}
		});
	},
	
	_controlDirtyObserver: Ember.observer('_controls.@each.isDirty',function(){		
		this.setDirty(this._dirty);
	}),
	
//	_valid : null,
//	
//	isValid : null,
	
	setValid : function(valid) {
		Ember.run.scheduleOnce('sync',this,function() {
			if(this.isDestroyed) {
				Ember.warn('Attempting to change validity of destroyed object '+this.toString());
				return;
			}
			if(this._valid!==valid) {				
				this.set('_valid',valid);
			}
			valid= valid!==false && this.get('controls').filterBy('isValid',false ).get('length')===0;
			if(valid!==this.isValid) {
				this.setFlag('isValid',valid);
				this.notifyChange();
			}
		});
	},
	
	_controlValidObserver: Ember.observer('_controls.@each.isValid',function(){
		this.setValid(this._valid);
	}),
	
//	willDestroy: function() {
//		this.get('controls').invoke('destroy');
//		this.set('_controls',null);
//		this._super();
//	}
	destroy : function() {
		var controls=this.get('controls');
		if(controls) {
			controls.invoke('destroy');
		}
		this._super();
	},
	
	_reset:function(modelChanged) {
		this._super(modelChanged);
		var controls=this.get('controls');
		if(controls) {
			controls.invoke('_reset',modelChanged);
		}
	},
	
});