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
			Ember.warn("No attribute in target model for input "+this._name+" (path "+this._path+")",this.get('_panel.for.'+this.get('_name'))!==undefined);
			if(this.get('_panel.for.'+this.get('_name'))!==undefined) {
				this.reopen({
					property:Ember.computed.alias('_panel.for.'+this.get('_name'))
				});
				
				this.set('value',this.get('property'));
				this.set('_orgValue',this.get('property'));
			}
			else {
				this.set('_orgValue',this.get('value'));
			}
		}
	},
	
	_propertyObserver:function(value) {
		
		// If we sync to the source, do not update the _orgValue so we keep a reliable dirty flag
		// If we're not syncing to the source, something else updated it and we should be dirty accordingly, so update _orgValue 
//		if(!this.get('_form._syncToSource')) {
//			this.set('_orgValue',this.get('property'));
//		}
//		if(this.get('_name') && this.get('_form._syncFromSource') && this.get('value')!==this.get('property')) {
		if( this.get('value')!==this.get('property')) {
			this.set('value',this.get('property'));
		}
		//this.setDirty(this.get('value')!==this.get('_orgValue'));
	}.observes('property'),
	
	
	_valueObserver:function() {
//		if(this.get('_name') && this.get('_form._syncToSource')) {
			this._apply();
//		}
		this.setDirty(this.get('value')!==this.get('_orgValue'));
		// This notification causes an extra event in "conditions" was it required? Yes. The other events were extra, trigger by accessing to hasPrerequisites aliased property
//		this._panel.propertyDidChange(this._name);
		this.notifyChange();
		this._components.invoke('set','value',this.get('value'));
	}.observes('value'),
	
	_apply: function() {
		if(this.property!==null) {
			Ember.run.once(this,function(){
				if(this.get('_panel.for')) {
					this.set('property',this.get('value'));
				}
			});
		}
	},
	
	_reset: function(modelChanged) {
		this._super(modelChanged);
		if(modelChanged) {
			this.set('_orgValue',this.get('property'));
		}
		this.set('value',this.get('_orgValue'));
		
	},
	
});