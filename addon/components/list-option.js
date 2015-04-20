import Input from './input';
import Ember from 'ember';
export default Input.extend({
	index : null,
	
	value : Ember.computed.alias('option.value'),
	
	caption : Ember.computed.alias('option.caption'),
	
	option: null,
	
	selected : function(key,value){
		if(value!==undefined) {	
			return value;
		}
		else {
			return this.get('_panel.selectedIndex')-1===this.index;
		}
	}.property('_panel.value'),
		
	
	control : Ember.computed.alias('option.control'),
	
	showControl :function() {
		return this.get('control') && this.get('selected');
	}.property('control,selected'),
	
	
	setValid:function(valid) {
		if(this.control && valid && this.get('control.isValid')===false) {
			this.control.send('validate');
			return this._super(false);
		}
		return this._super(valid);		
	},
	
	_controlValidObserver : function() {
		Ember.run.once(this,function(){			
			this.setValid(this.get('control.isValid'));
		});
	}.observes('control,control.isValid'),
});