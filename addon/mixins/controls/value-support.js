import Ember from 'ember';
export default Ember.Mixin.create({
	_orgValue : null,
	
	property: null,
	
	value:null,
	
	registerComponent:function(component) {
		this._super(component);
		component.set('value',this.get('value'));
	},
	
	init: function() {
		this._super();
		// If we do not have a name, we're an anonymous option without a counterpart in 
		if(this.get('_name')) {
//			Ember.warn("No attribute in target model for input "+this._name+" (path "+this._path+")",this.get('_panel.for.'+this.get('_name'))!==undefined);
//			if(this.get('_panel.for.'+this.get('_name'))!==undefined) {
			var propertyName= '_panel.'+(this._panel['for']  ? 'for.' : 'value.')+this.get('_name');
			this.reopen({
				property:Ember.computed.alias(propertyName)
			});
			var property=this.get('property');
			if(Ember.PromiseProxyMixin.detect(property)) {
				var control=this;
				property.then(function(propertyValue){
					control.set('value',propertyValue);
					control.set('_orgValue',propertyValue);
				});
			}
			else {
				this.set('value',this.get('property'));
				this.set('_orgValue',this.get('property'));
			}
//			}
//			else {
//				this.set('_orgValue',this.get('value'));
//			}
		}
	},
	
	_propertyObserver:function(value) {
		
		// If we sync to the source, do not update the _orgValue so we keep a reliable dirty flag
		// If we're not syncing to the source, something else updated it and we should be dirty accordingly, so update _orgValue 
//		if(!this.get('_form._syncToSource')) {
//			this.set('_orgValue',this.get('property'));
//		}
//		if(this.get('_name') && this.get('_form._syncFromSource') && this.get('value')!==this.get('property')) {
		
		// Only run this once. Ember-data relationships may have notified a change, but the changed relationship is not available.
		Ember.run.once(this,function() {
//			
			var property=this.get('property');
			if(Ember.PromiseProxyMixin.detect(property)) {
				var control=this;
				property.then(function(propertyValue){
					control.set('value',propertyValue);
				});
			}
			else {
				if( this.get('value')!==property) {
					this.set('value',this.get('property'));
				}
			}
		});
		//this.setDirty(this.get('value')!==this.get('_orgValue'));
	}.observes('property'),
	
	
	_valueObserver:function() {
		this._apply();
		this.setDirty(this.get('value')!==this.get('_orgValue'));
		this.notifyChange();
		
	}.observes('value'),
	
	_apply: function() {
		if(this.property!==null) {
			Ember.run.scheduleOnce('sync',this,function(){
				this._components.invoke('set','value',this.get('value'));
				if(this.get('property')!==this.get('value')) {
					try{
						this.set('property',this.get('value'));
					}
					catch(e) {
						Ember.warn(this.toString()+" (in panel "+this._panel.toString()+" with target "+this.get('_panel.for')+") could not update its corresponding property to the new value: "+e);
					}
				}
			});
		}
	},
	
	_reset: function(modelChanged) {
		this._super(modelChanged);
		var property=this.get('property');
		if(Ember.PromiseProxyMixin.detect(property)) {
			var control=this;
			this.set('_orgValue',null);
			this.set('value',null);
			property.then(function(propertyValue){
				if(modelChanged) {
					control.set('_orgValue',propertyValue);
				}
				control.set('value',propertyValue);
			});
		}
		else {
			if(modelChanged) {
				this.set('_orgValue',property);
			}
			this.set('value',property);
		}
	},
	
});