import Ember from 'ember';
import Input from 'furnace-forms/controls/input'; 
import Action from 'furnace-forms/controls/action'; 
import Panel from 'furnace-forms/controls/panel'; 
import Form from 'furnace-forms/controls/form'; 
import Condition from 'furnace-forms/controls/condition'; 
import PanelComponent from 'furnace-forms/components/panel';
import FormComponent from 'furnace-forms/components/form';

var getMeta=function(options) {
	return {
		type: 'form-control',
		options:options
	};
};

var getControl=function(type,options) {	
	options=options || {};
	var meta=getMeta(options);
	return Ember.computed(function(key) {
		Ember.assert("You have assigned a control to something thats not a Panel or Form",this instanceof PanelComponent);
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
};

var Helpers= Ember.Mixin.create({
	input : function(options) {		
		return getControl(Input,options);
	},
	
	action : function(options) {		
		return getControl(Action,options);
	},
	
	submit : function(options) {
		options=options || {};
		options.submit=true;
		return getControl(Action,options);
	},
	
	panel : function(options) {
		return getControl(Panel,options);
	},
	
	cond : function(props,fn,options) {
		var options=options || {};
		
		props="_form."+props.replace(/\,/,',_form.').replace(/\./g,'.value')+'.value';
		if(arguments.length===2) {
			options=fn;
			options._conditionFn=function() {
				var props=this._conditionProps.split(',');		
				for(var i=0; i<props.length;i++) {
					if(!this.get(props[i])) {
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
		options._conditionProps=props;
		return getControl(Condition,options);
	},
	
	form: function() {
		var options;
		if(arguments.length===1) {
			if(arguments[0].superclass===FormComponent) {
				return getControl(Form,{'_component': arguments[0]});
			}
			options=arguments[0];
		}else if(arguments.length===2) {
			options=arguments[1];
			options._modelName=arguments[0];
		} else {
			Ember.assert('The form helper accepts either 1 or 2 arguments');
		}
		return FormComponent.extend(options);
	}
});


export default Helpers;