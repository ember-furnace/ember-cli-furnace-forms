import Ember from 'ember';
import OptionsSupport from './options-support';

export default Ember.Mixin.create({
	
	_decoratorName : 'check',
	
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
		if(selected) {
			this.send('select',index);
		}
		else { 
			this.send('unselect',index);
		}
	},
	
	init: function() {
		this._super();
		this.addObserver('_options.[]',this,this._updateSelection);
		if(this.get('value')!==null) {
			this._valueObserver();
		}
		Ember.warn('No options support for multi-select',OptionsSupport.detect(this),{id:'furnace-forms:control.options-support-missing'});
	},
	
	getOption: function(index) {
		return this.get('_options')[index];			
	},
	
//	_optionsChangeObserver: Ember.observer('_options,_options.[]',function() {
//		this._updateSelection();
//	}),
	
	_updateSelection() {
		var changed=false;
		var value=this.get('value');
		if(Ember.Enumerable.detect(value)) {
			this.get('_options').forEach(function(option) {
				if(value.includes(option.get('value'))) {
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
		}
		if(changed) {
			this.notifyChange();
		}
	},
	
	_valueObserver() {
		this._super();
		this._updateSelection();
	},
	
});