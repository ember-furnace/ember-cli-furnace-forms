import Ember from 'ember';
import Panel from 'furnace-forms/controls/panel';
import getControl from 'furnace-forms/utils/get-control';
import Control from  'furnace-forms/controls/abstract';
import ControlSupport from 'furnace-forms/mixins/controls/control-support';

import Conditions from 'furnace-forms/utils/conditions';
import Options from 'furnace-forms/utils/options';

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
	var control = Ember.computed(function(key) {
		Ember.assert("You have assigned a control with key "+key+" to "+this.toString()+" but it has no control-support like a Panel, Form or Option",ControlSupport.detect(this));
		if(!this._controls) {
			this._controls=Ember.A();
		}
		if(!this._controls[key]) {
			this._controls[key]=null;
			this._controls[key]=getControl.call(this,key,options._controlType,options);
			
		}			
		return this._controls[key];
	});
	
	control.meta(meta);
		

	control.cond=Conditions;
	control.on=Conditions;
	control.options=Options;
	return control;
}

export { computedControl};