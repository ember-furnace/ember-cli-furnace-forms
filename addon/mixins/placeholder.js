import Ember from 'ember';
import I18n from 'furnace-i18n';

export default Ember.Mixin.create({
	
	placeholder:I18n.computed(null),
	
	init : function() {
		var caption=this.get('caption');
		this._super();
		if( this.placeholder instanceof Ember.ComputedProperty && caption===null && this.get('placeholder')===null) {
			var name=this.get('_panel._modelName')+'.'+this.get('_name');
			this.set('placeholder',name+"Placeholder");
		}
	},
});