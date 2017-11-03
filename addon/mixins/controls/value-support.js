import Ember from 'ember';
export default Ember.Mixin.create({
	_orgValue : null,
	_orgArray : null,
	
	_didSetupValue: false,
	
	property: undefined,
	
	value:null,
	
	registerComponent:function(component) {
		this._super(component);
		component.set('value',this.get('value'));
	},
	
	actions : {
		
		onChange:function() {
			
		}
	},
	init: function() {
		this._super();
		// If we do not have a name, we're an anonymous option without a counterpart in 
		if(this.get('_name')!==null) {
//			Ember.warn("No attribute in target model for input "+this._name+" (path "+this._path+")",this.get('_panel.for.'+this.get('_name'))!==undefined);
//			if(this.get('_panel.for.'+this.get('_name'))!==undefined) {
			var propertyName= '_panel.'+(this._panel['_model']  ? '_model.' : 'value.')+this.get('_name');
			if(this.property===undefined) {
				this.reopen({
					property:Ember.computed.alias(propertyName)
				});
			}
			
			this._setupValue()

		}
	},
	
	_setupValue(value,resetOrgValue) {
		var property;
		if(arguments.length===0) {
			property=this.get('property');
			if(property instanceof Ember.RSVP.Promise || Ember.PromiseProxyMixin.detect(property)) {
				var control=this;
				property.then(function(propertyValue){
					if(!control.isDestroyed) {
						control._setupValue(propertyValue);
					}
				});
				return;
			}
		}
		
		value=value || (property || this.get('property'));
		
		if(Ember.PromiseProxyMixin.detect(value)) {
			value=Ember.get(value,'content');
		}
		
		let isEnum=false;
		if(Ember.Enumerable.detect(value)) {
			value=value.toArray();
			isEnum=true;
		}
		if(!this._didSetupValue) {
			this.addObserver('property',this._propertyObserver);
			this.addObserver('value',this._valueObserver);
			if(isEnum) {
				this.addObserver('property.[]',this._propertyObserver);
				this.addObserver('value.[]',this._valueObserver);
			}
		} 
		if(!this._didSetupValue || resetOrgValue) {
			this._setOrgValue(value);
			this._didSetupValue=true;
		}
		var currentValue=this.get('value');
		
		if(isEnum && Ember.Array.detect(currentValue) && Ember.compare(value,currentValue)!==0) {
			currentValue.setObjects(value);
		} else if(currentValue!==value){
			this.set('value',value);
		}
		
		if(resetOrgValue) {
			this._updateDirty();
		}
	},
	
	// We no longer schedule or observe this directly, observer will be initialized when the initialization completes (with resolved property promise)
	// Think again. While the promise may have been fulfilled, a change may be triggered while promise content has not been set
	_propertyObserver:function() {
		
		// If we sync to the source, do not update the _orgValue so we keep a reliable dirty flag
		// If we're not syncing to the source, something else updated it and we should be dirty accordingly, so update _orgValue 
//		if(!this.get('_form._syncToSource')) {
//			this._setOrgValue(this.get('property'));
//		}
		
		// Only run this once. Ember-data relationships may have notified a change, but the changed relationship is not available.
		Ember.run.scheduleOnce('sync',this,this._propertyObserverUpdate);
//		this._propertyObserverUpdate();
		//this.setDirty(this.get('value')!==this.get('_orgValue'));
	},
	
	_propertyObserverUpdate: function() {
		this._setupValue();
	},
	
	_valueObserver:function() {
		if(this._didSetupValue) {
			this._apply();
			this._updateDirty();
			this.send('onChange');
			this.notifyChange();
		}
	},
	
	_updateDirty :function() {
		var value=this.get('value');
		var dirty=false;		
		if(value && this._orgArray) {
			var orgArray=this._orgArray;
			if(value.length!==orgArray.length) {
				dirty=true;
			}
			else {
				value.forEach(function(value) {
					if(!orgArray.includes(value)) {
						dirty=true;
					}
				});
			}
			
		} else if(value!==this.get('_orgValue')) {
			dirty=true;
		}
		this.setDirty(dirty);
	},
	
	_apply: function() {
		if(!this._didSetupValue) {
			return;
		}
		if(this.property!==null) {
			var property=this.get('property');
			var value=this.get('value');
			this._components.invoke('set','value',this.get('value'));
			
			if(!this.get('_panel._model')) {
				// Don't apply when our panel is modelless
				return;
			} 

			if(Ember.Enumerable.detect(property)) {
				if(Ember.PromiseProxyMixin.detect(property)) {
					property=Ember.get(property,'content');
				}
				if(Ember.compare(value,property.toArray())!==0) {
					property.setObjects(value);
				}
			}
			else if(value!==property) {				
				if(property instanceof Ember.RSVP.Promise || Ember.PromiseProxyMixin.detect(property)) {
					var control=this;
					property.then(function(propertyValue) {
						if(value!==propertyValue) {
							try{
								control.set('property',value);
							}
							catch(e) {
								Ember.warn(control.toString()+" (in panel "+control._panel.toString()+" with target "+control.get('_panel._model')+") could not update its corresponding promise property to the new value: "+e,false,{id:'furnace-forms:control.value-support.apply-exception'});
							}
						}
					});
				} else {
					try{
						this.set('property',value);
					}
					catch(e) {
						Ember.warn(this.toString()+" (in panel "+this._panel.toString()+" with target "+this.get('_panel._model')+") could not update its corresponding property to the new value: "+e,false,{id:'furnace-forms:control.value-support.apply-exception'});
					}
				}
			}
		}
	},
	
	_reset: function(modelChanged) {
		if(modelChanged) {
			var property=null;
			if(this.get('_panel._model')) {
				property=this.get('property');	
			} 
			
			if(property instanceof Ember.RSVP.Promise || Ember.PromiseProxyMixin.detect(property)) {
				var control=this;
				// We no longer nullify value and orgValue, this triggers observers which might not trigger again if our promise returns
				// in the same runloop
				property.then(function(property){
					if(Ember.PromiseProxyMixin.detect(property)) {
						property=Ember.get(property,'content');
					}
					
					if(control.get('value')!==property) {
						control._setupValue(property,true);
					} else {
						control._setOrgValue(property);
						control._updateDirty();
					}
					
				});
			}
			else {				
				if(property!==this.get('value')) {
					this._setupValue(property,true);
				} else {
					this._setOrgValue(property);
					this._updateDirty();
				}
			}
		}
		else {
			if(Ember.MutableArray.detect(this._orgValue)) {
				this.get('value').setObjects(this._orgArray.toArray());
			} else {
				this.set('value',this._orgValue);
			}
		}
		this._super(modelChanged);
	},
	
	_setOrgValue: function(orgValue) {
		this.set('_orgValue',orgValue);
		if(Ember.MutableArray.detect(orgValue)) {
			this.set('_orgArray',orgValue.toArray());
		} else {
			this.set('_orgArray',null);
		}
	},
	
	isEmpty : true,
	
	
	_emptyObserver: Ember.observer('value',function() {
		var empty=false
		if(this.get('value')==="" || this.get('value')===undefined || this.get('value')===null) {
			empty=true;
		}		
		this.setFlag('isEmpty',empty);
	}),
	
	_emptyInit: Ember.on('init',function() {
		this._emptyObserver();
	})
});