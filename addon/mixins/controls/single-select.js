import Ember from 'ember';
import OptionsSupport from './options-support';

export default Ember.Mixin.create({
	optionControl : null,
	
	showOptionControl : false,
	
	actions : {
		
	},
	
	select: function(index) {
		this.set('value',this.get('_options')[index-1].value);
		
		this.get("_options").invoke('set','selected',false);
		var option=this.get("_options").findBy('index',index);
		if(option) {
			option.set('selected',true);
		}
		this._valueObserver();
	},
	
	_selectedIndexObserver:Ember.observer('selectedIndex', function() {
		Ember.run.once(this,function() {
			var option = this.getOption();
			if(option && option.value!==this.get('value')) {
				this.set('value',option.value);				
			}
			else {
				if(this.get('selectedIndex')===null) {
					this.set('value',null);
				}
			}
			var ret=null;
			
			// Use option control directly instead of generating our own
//			var	oldValue=this.get('optionControl');
//			if(option && option.control) {						
//				var options=option.control._meta.options;
//				options['for']=this.get('value');
//				options._path=this._panel._path;
//				ret = option.get('optionControl');
//				this.set('showOptionControl',true);
//			} 
//			else { 
//				this.set('showOptionControl',false);			
//			}	
			
			this.get("_options").invoke('set','selected',false);
			option = this.get("_options").findBy('index',this.get('selectedIndex'));
			if(option) {
				option.set('selected',true);
			}
			if(this._controlsLoaded) {
				var control=this.get("controls").findBy('index',this.get('selectedIndex'));
				if(control) {
					ret = control.get('optionControl');
					if(ret) {
						this.set('showOptionControl',true);
					}
					else { 
						this.set('showOptionControl',false);
					}
				}
			}
			// Since we're using the options control, dont destroy it.
//			if(oldValue) {
//				Ember.run.later(function() {
//					oldValue.destroy();
//				});
//			}
			this.set('optionControl',ret);
		});
	}),

	init: function() {
		this._super();
		Ember.warn('No options support for single-select',OptionsSupport.detect(this));	
	},
	
	getOption: function(index) {
		if(index===undefined) {
			index=this.get('selectedIndex')-1;
		}
		return this.get('_options')[index];			
	},
	
	selectedOption : Ember.computed(function(key,value) {
		if(value) {
			this.set('value',value.get('value'));
		}
		return this.getOption();
	}),
	
	selectedIndex : 0,
	
	_valueObserver: Ember.observer('value,_options',function() {
		this._super();
		var option=this.getOption();
		if(!option || this.get('value')!==option.value) {
			if(this.get('_options')) {
				option = this.get('_options').findBy('value',this.get('value'));
				this.set('selectedIndex',this.get('_options').indexOf(option)+1);
			}
			
		} else if(option && !option.get('selected')){
			this._selectedIndexObserver();
		}
	}),
	
	_optionsObserver: Ember.observer('_options',function() {
		Ember.debug('options changed');
//		this._valueObserver();
//		this._selectedIndexObserver();
	}),
	
	setValid: function(valid) {
		Ember.run.once(this,function() {
			if(this.optionControl && valid && this.get('optionControl.isValid')===false) {
				var isValid=this.get('isValid');		
				this.setFlag('isValid',false);
				this.set('_valid',valid);
				if(isValid===true) {
					this.notifyChange();
				}
			}
			else if(valid!==this._valid || valid!==this.isValid) {	
				this.setFlag('isValid',valid);
				this.set('_valid',valid);
				this.notifyChange();
			}
		});
	},
	
	_apply : function() {
		if(this.optionControl) {
			// Notify the optionControl the model has changed
			// The optionControl is tied to the option, don't reset
			//this.optionControl._reset(true);
		}
		this._super();
	},
	
	_reset : function(modelChanged) {
		if(this.optionControl) {
			this.optionControl._reset(modelChanged);
		}
		this._super(modelChanged);
	},
	
	_controlValidObserver : function() {
		Ember.run.once(this,function() {
			this.setValid(this._valid);
		});
	}.observes('optionControl,optionControl.isValid'),
		
});