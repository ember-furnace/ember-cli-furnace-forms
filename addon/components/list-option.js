import Input from './input';
import Ember from 'ember';
export default Input.extend({
	index : Ember.computed.alias('control.index'),
	
	actions : {
		select: function() {
			
			this.control.send('select',this.control.index);
			
		}
	},
	
//	value : Ember.computed.alias('option.value'),
	
//	caption : Ember.computed.alias('option.caption'),
	
//	option: null,
	
	selected : Ember.computed.alias('control.selected'),
	
	name : Ember.computed.alias('control._panel._name'),
	
//	control : Ember.computed.alias('option.control'),
	
//	showControl :function() {
//		return this.get('control') && this.get('selected');
//	}.property('control,selected'),
//	
	
//	setValid:function(valid) {
//		if(this.control && valid && this.get('control.isValid')===false) {
//			this.control.send('validate');
//			return this._super(false);
//		}
//		return this._super(valid);		
//	},
//	
//	_controlValidObserver : function() {
//		Ember.run.once(this,function(){			
//			this.setValid(this.get('control.isValid'));
//		});
//	}.observes('control,control.isValid'),
});