import Ember from 'ember';
import PanelComponent from 'furnace-forms/components/panel';
import FormComponent from 'furnace-forms/components/form';
import Control from 'furnace-forms/controls/abstract';
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
		Ember.assert("You have assigned a control to something thats not a Panel or Form",this instanceof PanelComponent);
		if(!this._controls) {
			this._controls=Ember.A();
		}
		if(!this._controls[key]) {
			this._controls[key]=null;
			var meta = this.constructor.metaForProperty(key);
			
			var options=meta.options;
			options._name=key;
			if(this instanceof FormComponent && !this._form) {
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
	
	control.cond=function(props,fn) {
		var _props=props.split(',');
		var length=_props.length;
		var _fn;	
		var options=this._meta.options;
		
		for(var i =0;i<length;i++) {
			_props[i]='_form.'+_props[i];			
		}
		if(arguments.length===1) {
			options._conditionFn=function() {				
				var props=this._conditionProps.split(',');		
				for(var i=0; i<props.length;i++) {
					var prop=this.get(props[i]);
					if(prop instanceof Control) {
						if(!prop.get('value') || prop.get('isValid')===false){
							return false;
						}
					}
					else if(!prop) {
						return false;
					}					
				}
				return true;
			};
		}
		else {
			options._conditionFn=function() {
				return fn.call(this._form);
			}
		}
		options._conditionProps=_props.join(',');		
		return this;
	}
	return control;
}

export { computedControl};