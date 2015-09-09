import Ember from 'ember';
import Panel from 'furnace-forms/controls/panel';
import getControl from 'furnace-forms/utils/get-control';
import Control from  'furnace-forms/controls/abstract';
import ControlSupport from 'furnace-forms/mixins/controls/control-support';

import Conditions from 'furnace-forms/utils/conditions';
import Options from 'furnace-forms/utils/options';
import Item from 'furnace-forms/utils/item';
import Number from 'furnace-forms/utils/number';

function getMeta(options) {
	options._mixin={};
	return {
		type: 'form-control',
		options:options
	};
};


function computedControl(type,options) {
	options=options || {};
	options._controlType=type;
	var meta=getMeta(options);
	var control = Ember.computed(function(key,value,oldValue) {
		Ember.assert("You have assigned a control with key "+key+" to "+this.toString()+" but it has no control-support like a Panel, Form or Option",ControlSupport.detect(this));
		if(!this.__controls) {
			this.__controls={};
		}

		if(!this.__controls[key]) {
			if(this.__controls[key]===null) {
				Ember.warn('furnace-forms: trying to access control "'+key+'" but its currently being initialized');
				return null;
			}
			this.__controls[key]=null;
			this.__controls[key]=getControl.call(this,key,options._controlType,options);
		}			
		return this.__controls[key];
	});
	
	control.meta(meta);
		

	control.cond=Conditions;
	control.on=Conditions;
	control.options=Options;
	control.item=Item;
	control.number=Number;
	return control;
}

export { computedControl};