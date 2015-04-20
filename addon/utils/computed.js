import Ember from 'ember';
import PanelComponent from 'furnace-forms/components/panel';
import FormComponent from 'furnace-forms/components/form';

import ControlSupport from 'furnace-forms/mixins/control-support';

import Conditions from 'furnace-forms/utils/conditions';
import Options from 'furnace-forms/utils/options';

function getMeta(options) {
	return {
		type: 'form-control',
		options:options
	};
};


function computedControl(type,options) {
	options=options || {};
	var meta=getMeta(options);
	var control = Ember.computed(function(key) {
		Ember.assert("You have assigned a control to something that does not have support controls, eg: Panel, Form or Option",ControlSupport.detect(this));
		if(!this._controls) {
			this._controls=Ember.A();
		}
		if(!this._controls[key]) {
			this._controls[key]=null;
			var meta = this.constructor.metaForProperty(key);
			
			var options=meta.options;
			options._name=key;
			if(this instanceof FormComponent) {
				options._form=this;
			}
			else {
				options._form=this._form;
			}
			
			options._panel=this;
			
			if(typeof type.generate==='function') {
				this._controls[key]=type.generate(options);				
			} else {
				this._controls[key]=type.create(options);
			}
		}			
		return this._controls[key];
	}).meta(meta);
	
	control.cond=Conditions;
	control.options=Options;
	return control;
}

export { computedControl};