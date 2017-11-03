import Ember from 'ember';
import Action from 'furnace-forms/controls/action';
export default Ember.Mixin.create({
	_controls : null,
	
	_loadingControls: false,
	
	init : function() {
		this._super();
		// "for" or "value" might not be available yet
//		if(!this.get('_model')) {
//			Ember.run.later(this,this._loadControls);
//		} else {
//			this._loadControls();
//		}
	},
	
	controls: Ember.computed('_controls',{
		get : function() {
			if(this._controls===null) {
				this._loadControls();
			}
			return this._controls;
		}
	}).readOnly(),
	
	_modelObserver : Ember.observer('_model',function() {
		this._super.apply(this,arguments);
		if(this._controls===null) {
			this._loadControls();
		}
	}),
	
	_loadControls : function() {
		if(!this.get('_model')) {		   
			return;
		}
		if(this._loadingControls) {
			return;
		}
		this._loadingControls=true;
		var control=this;
		var controls=Ember.A();
		if(this.isDestroyed) {
			return;
		}
		control.constructor.eachComputedProperty(function(name, meta) {		
			if (meta.type==='form-control') {
				let _control=control.get(name);
				if(_control) {
					controls.pushObject(_control);
				}
			}
		});		
		if(this.isDestroyed) {
			return;
		}
		this.set('_controls',controls);

		// Fixes issue with isValid flags not propegating
		// Sets form to valid before validation was run, so disable this
		// So now we call this observer anyway, but we do not specify a key, to prevent actually
		// updating the valid state
		this._controlValidObserver();
	},
	
	inputControls: Ember.computed('_controls',{
		get : function() {
			var ret = Ember.A();
			if(this._controls===null) {
				this._loadControls();
			}
			var self = this;
			this.constructor.eachComputedProperty(function(name, meta) {
				if (meta.type==='form-control' && !(self.get(name) instanceof Action)) {
					ret.pushObject(self.get(name));
				}
			});
			return ret;
		}
	}).readOnly(),
	
	actionControls: Ember.computed('_controls',{
		get : function() {
			var ret = Ember.A();
			if(this._controls===null) {
				this._loadControls();
			}
			var self = this;
			this.constructor.eachComputedProperty(function(name, meta) {
				if (meta.type==='form-control' && (self.get(name) instanceof Action)) {
					ret.pushObject(self.get(name));
				}
			});
			return ret;
		}
	}).readOnly(),
	
//	_dirty : false,
//	
//	isDirty : false,
	
	setDirty : function(dirty) {
		Ember.run.scheduleOnce('sync',this,this._syncDirty,dirty);
	},
	
	_syncDirty : function(dirty) {
		if(this._dirty!==dirty) {
			this.set('_dirty',dirty);
		}
		dirty=dirty || this.get('controls').filterBy('isDirty', true).get('length')>0;
		if(this.isDirty!==dirty) {
			this.setFlag('isDirty',dirty);
		}
	},
	
	_controlDirtyObserver: Ember.observer('controls.@each.isDirty',function(){			
		this.setDirty(this._dirty);
	}),
	
//	_valid : null,
//	
//	isValid : null,
	
	setValid : function(valid) {
		this._syncValid(valid);
		//Ember.run.scheduleOnce('sync',this,this._syncValid,valid);
	},
	
	_syncValid : function(valid) {
		if(this.isDestroyed) {
			Ember.warn('Attempting to change validity of destroyed object '+this.toString(),false,{id:'furnace-forms:control.control-support.validity-destroyed'});
			return;
		}
		if(this._valid!==valid) {				
			this.set('_valid',valid);
		}
		valid= valid!==false && this.get('controls').filterBy('isValid',false ).get('length')===0;
		if(valid!==this.get('isValid')) {
			this.setFlag('isValid',valid);
			this.notifyChange();
		}
	},
	
	_controlValidObserver: Ember.observer('controls.@each.isValid',function(sender,key){
		// If we don't get a key, we were called manually to prime the observed properties
		// If we already have an invalid control, because validation already took place,
		// then update validity anyway
		if(key || this.get('controls').filterBy('isValid',false ).get('length')>0) {
			this.setValid(this._valid);
		}
	}),
	
	
	willDestroy : function() {
		var controls=this._controls;
		if(controls && controls.length) {
			controls.invoke('willDestroy');
		}
		this._super();	
	},
	
	destroy : function() {
		var controls=this._controls;
		if(controls && controls.length) {
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