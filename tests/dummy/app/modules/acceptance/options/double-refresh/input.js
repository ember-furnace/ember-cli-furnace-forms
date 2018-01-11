import Ember from 'ember';
import Forms from 'furnace-forms';
export default Forms.Controls.Input.extend({

	property:Ember.computed({
		get() {
			this._form.notifyPropertyChange("_model");
			return 1;
		}	
	})
});