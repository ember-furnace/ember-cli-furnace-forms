import Ember from 'ember';
import OptionsSupport from './options-support';
import Form from 'furnace-forms/controls/form';
import Forms from 'furnace-forms';
import getControl from 'furnace-forms/utils/get-control';

export default Ember.Mixin.create({
	actions : {

		
	},
	
	select: function(index,selected) {
		if(selected)
			this.get('value').pushObject(this.get('_options')[index-1].value);
		else 
			this.get('value').removeObject(this.get('_options')[index-1].value);
		if(this._controlsLoaded) {
			var control=this.get("controls").findBy('index',index);
			if(control)
				control.set('selected',selected);
		}
		this._valueObserver();
	},
	
	init: function() {
		this._super();
		console.trace();
		Ember.warn('No options support for multi-select',OptionsSupport.detect(this));
	},
	
	getOption: function(index) {
		return this.get('_options')[index];			
	},
	
	_valueObserver: Ember.observer('value,_options',function() {
		this._super();
		var changed=false;
		var value=this.get('value');
		this.get('_options').forEach(function(option) {
			if(value.contains(option.get('value'))) {
				if(option.get('selected')!==true) {
					changed=true;
					option.set('selected',true);
				}
			} else {
				if(option.get('selected')!==false) {
					changed=true;
					option.set('selected',false);
				}
			}
		});
		if(changed) {
			this.notifyChange();
		}
	}),
	
//	setValid: function(valid) {
//		Ember.run.once(this,function() {
//			if(valid) {
//				var isValid=this.get('isValid');
//				var control=this;
//				var doBreak=false;
//				this.get('_options').forEach(function(option) {					
//					var optionControl=option.get('control');
//					if(control && !control.get('isValid')) {
//						control.setFlag('isValid',false);
//						doBreak=true;
//					}
//				});												
//				control.set('_valid',valid);
//				if(doBreak)
//					return;
//			}
//			if(valid!==this._valid || valid!==this.isValid) {	
//				this.setFlag('isValid',valid);
//				this.set('_valid',valid);
//				this.notifyChange();
//			}
//		});
//	},
//	
//	_apply : function() {
//		this.get('_options').forEach(function(option) {
//			var control=option.get('control');
//			if(control)
//				control._apply();
//		});		
//	},
//	
//	_reset : function(modelChanged) {
//		this.get('_options').forEach(function(option) {
//			var control=option.get('control');
//			if(control)
//				control._reset(modelChanged);
//		});		
//		this._super(modelChanged);
//	},
//	
//	_controlValidObserver : function() {
//		Ember.run.once(this,function() {
//			this.setValid(this._valid);
//		});
//	}.observes('_options.@each.control,_options.@each.control.isValid'),
		
});