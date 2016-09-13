import Ember from 'ember';
export default Ember.Mixin.create({
	_orgValue : null,
	_orgArray : null,
	
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
			var property=this.get('property');
			if(property instanceof Ember.RSVP.Promise || Ember.PromiseProxyMixin.detect(property)) {
				var control=this;
				
				property.then(function(propertyValue){
					control.addObserver('property',control._propertyObserver);
					control._setOrgValue(propertyValue);
					control.set('value',propertyValue);
				});
			}
			else {
				this.addObserver('property',this._propertyObserver);
				this._setOrgValue(this.get('property'));
				this.set('value',this.get('property'));
			}

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
		var property=this.get('property');
		if(property instanceof Ember.RSVP.Promise || Ember.PromiseProxyMixin.detect(property)) {
			var control=this;
			property.then(function(property){
				if( control.get('value')!==property) {
					control.set('value',property);
				}
			});
		}
		else {
			if( this.get('value')!==property) {
				this.set('value',property);
			}
		}
	},
	
	_valueObserver:Ember.observer('value',function() {
		this._apply();
		this._updateDirty();
		this.send('onChange');
		this.notifyChange();
	}),
	
	_updateDirty :function() {
		var value=this.get('value');
		var dirty=false;		
		if(value!==this.get('_orgValue')) {
			dirty=true;
		} else if(this._orgArray) {
			var orgArray=this._orgArray;
			if(value.length!==orgArray.length) {
				dirty=true;
			}
			else {
				value.forEach(function(value) {
					if(!orgArray.contains(value)) {
						dirty=true;
					}
				});
			}
			
		} 
		this.setDirty(dirty);
	},
	
	_apply: function() {
		if(this.property!==null) {
			var property=this.get('property');
			var value=this.get('value');
			this._components.invoke('set','value',this.get('value'));
			
			if(Ember.Enumerable.detect(property)) {
				if(property instanceof Ember.RSVP.Promise || Ember.PromiseProxyMixin.detect(property)) {
					property=property._content;
				}
				var dirty=false;
				if(value.get('length')!==property.get('length')) {
					dirty=true;
				}
				else {
					value.forEach(function(value) {
						if(!property.contains(value)) {
							dirty=true;
						}
					});
					property.forEach(function(property) {
						if(!value.contains(property)) {
							dirty=true;
						}
					});						
				}
				if(dirty) {
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
			var property=this.get('property');
			if(property instanceof Ember.RSVP.Promise || Ember.PromiseProxyMixin.detect(property)) {
				var control=this;
				// We no longer nullify value and orgValue, this triggers observers which might not trigger again if our promise returns
				// in the same runloop
				property.then(function(property){
					if(modelChanged) {
						control._setOrgValue(property);
					}
					if(control.get('value')!==property) {
						control.set('value',property);
					} else {
						control._updateDirty();
					}
					
				});
			}
			else {				
				this._setOrgValue(property);
				if(property!==this.get('value')) {
					this.set('value',property);
				} else {
					this._updateDirty();
				}
			}
		}
		else {
			if(Ember.MutableArray.detect(this._orgValue)) {
				this.getValue('value').setObjects(this._orgArray.toArray());
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
	
	isEmpty : Ember.computed('value',{
		get : function() {
			if(this.get('value')==="" || this.get('value')===undefined || this.get('value')===null) {
				return 'empty';
			}
			return '';
		}
	}).readOnly(),
	
});