import Forms from 'furnace-forms';
import Ember from 'ember';

export default Forms.Inputs.Button.extend({
	
	actions: {
		click:function() {			
			this.send('validate',this.get('control.conditionProperties'));
			if(this.get('isEnabled')) {
				this.control.setValid(true);
				this.send(this.get('name'));
			}
		}
	},
	
	value : false,
	
	init : function() {
		this._super();
		this.updateEnabled();
	},
	
	updateEnabled:Ember.observer('hasPrerequisites',function() {
		Ember.run.once(this,function() {
			if(this.get('hasPrerequisites')===true) {
				if(!this.control.get('isValid'))
					this.control.setEnabled(true);
			} else {
				this.control.setEnabled(false);
				this.control.setValid(false);
			}
		});
	}),
});