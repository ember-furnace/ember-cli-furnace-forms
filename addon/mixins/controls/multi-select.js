import Ember from 'ember';
import OptionsSupport from './options-support';
import Form from 'furnace-forms/controls/form';
import Forms from 'furnace-forms';
import getControl from 'furnace-forms/utils/get-control';

export default Ember.Mixin.create({
	actions : {
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
		
	},
	

	init: function() {
		this._super();
		Ember.warn('No options support for multi-select',OptionsSupport.detect(this));
	},
	
	getOption: function(index) {
		return this.get('_options')[index];			
	},
	
	_valueObserver: Ember.observer('value,_options',function() {
		this._super();
		var value=this.get('value');
		this.get('_options').forEach(function(option) {
			if(value.contains(option.get('value'))) {
				option.set('selected',true);
			} else {
				option.set('selected',false);
			}
		});
	}),
	
//	setValid: function(valid) {
//		Ember.run.once(this,function() {
//			if(this.optionControl && valid && this.get('optionControl.isValid')===false) {
//				var isValid=this.get('isValid');		
//				this.setFlag('isValid',false);
//				this.set('_valid',valid);
//				if(isValid===true)
//					this.notifyChange();
//			}
//			else if(valid!==this._valid || valid!==this.isValid) {	
//				this.setFlag('isValid',valid);
//				this.set('_valid',valid);
//				this.notifyChange();
//			}
//		});
//	},
	
//	_apply : function() {
//		if(this.optionControl) {
//			this.optionControl._apply();
//		}
//		this._super();
//	},
//	
//	_reset : function(modelChanged) {
//		if(this.optionControl) {
//			this.optionControl._reset(modelChanged);
//		}
//		this._super(modelChanged);
//	},
//	
//	_controlValidObserver : function() {
//		Ember.run.once(this,function() {
//			this.setValid(this._valid);
//		});
//	}.observes('optionControl,optionControl.isValid'),
		
});