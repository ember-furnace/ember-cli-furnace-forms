import Ember from 'ember';
import OptionsSupport from './options-support';
import Form from 'furnace-forms/controls/form';
import Forms from 'furnace-forms';
import getControl from 'furnace-forms/utils/get-control';

export default Ember.Mixin.create({
	actions : {
		select : function(index) {
			
		},
		unselect : function(index) {
			
		},
	},
	
	select: function(index,selected) {
		if(selected) {
			this.get('value').pushObject(this.get('_options')[index-1].value);
		} else  { 
			this.get('value').removeObject(this.get('_options')[index-1].value);
		}
		if(this._controlsLoaded) {
			var control=this.get("controls").findBy('index',index);
			if(control) {
				control.set('selected',selected);
			}
		}
		this._valueObserver();
		if(selected) {
			this.send('select',index);
		}
		else { 
			this.send('unselect',index);
		}
	},
	
	init: function() {
		this._super();
		this._valueObserver();
		Ember.warn('No options support for multi-select',OptionsSupport.detect(this),{id:'furnace-forms:control.options-support-missing'});
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
	
});