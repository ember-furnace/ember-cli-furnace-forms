import Ember from 'ember';
import I18n from 'furnace-i18n';

export default Ember.Mixin.create({
	
	placeholder:I18n.computed(null),
	
	init : function() {
		this._super();
		if( this.placeholder instanceof Ember.ComputedProperty  && this.get('placeholder')===null) {
			if(this.get('control.placeholder')!==undefined) {
				this.set('placeholder',this.get('control.placeholder'));
			}
			else { 
				var prefix=this.get('control._form._modelName') ? this.get('control._form._modelName') + '.' : '';
				var name=prefix+ ((this.get('control._panel._path')  ? this.get('control._panel._path') + '.' : '') + this.get('control._name'));
				this.set('placeholder',name+"Placeholder");
			}
		}
	},
});