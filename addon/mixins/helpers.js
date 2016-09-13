import Ember from 'ember';
import Form from 'furnace-forms/controls/form';

import {computedControl} from 'furnace-forms/utils/computed';

function getOptions(args,defaultType) {
	var options=null;
	var type=null;
	if(args.length===0) {
		options={};
		type=defaultType;
	}
	else if(args.length===1) {
		if(typeof args[0]==='string') {
			options={};			
			type=args[0];
		} else { 
			options=args[0];
			type=defaultType;
		}
	} else {
		type=args[0];
		options=args[1];
	}
	// Deprecated, we now use decorator attribute which we don't overwrite here 
	options._decoratorName = type;
	return options;
}



var getControl=function(type,options) {
	return computedControl(type,options);
};

var Helpers= Ember.Mixin.create({
	
	control : function(control,options) {
		options=getOptions(arguments);
		return getControl('control:'+control,options);
	},
	
	input : function(name,options) {
		switch(name) {
			case undefined:
				return this.text();
			case 'check':
				Ember.deprecate('furnace-forms: the "check" input is deprecated, use "checklist" instead',{id:'furnace-forms:input.check'});
				name='checklist';
				return this[name].apply(this,name,options); 
			case 'radio':
			case 'checklist':
			case 'button':
			case 'checkbox':
			case 'number':
			case 'password':
			case 'select':
			case 'submit':
			case 'text':
			case 'textarea':
				return this[name].apply(this,arguments); 
		}
		return getControl('input:'+name,options);
	},
	
	text : function(decoratorName,options) {
		options=getOptions(arguments,'text');
		return getControl('input:default',options);
	},
	
	password : function(decoratorName,options) {
		options=getOptions(arguments,'password');
		return getControl('input:default',options);
	},
	
	textarea : function(decoratorName,options) {
		options=getOptions(arguments,'textarea');
		return getControl('input:default',options);
	},
	
	checkbox : function(decoratorName,options) {
		options=getOptions(arguments,'checkbox');
		return getControl('input:default',options);
	},
	
	number : function(decoratorName,options) {
		options=getOptions(arguments,'number');
		return getControl('input:number',options);
	},
	
	options : function(decoratorName,options) {
		options=getOptions(arguments,'radio');
		return getControl('input:options',options);
	},
	
	radio : function(decoratorName,options) {
		options=getOptions(arguments,'radio');
		return getControl('input:options',options).singleSelect();
	},
	
	select : function(decoratorName,options) {
		options=getOptions(arguments,'select');
		return getControl('input:options',options).singleSelect();
	},
	
	checklist : function(decoratorName,options) {
		options=getOptions(arguments,'checklist');
		return getControl('input:options',options).multiSelect();
	},
	
	list : function(decoratorName,options) {
		options=getOptions(arguments,'list');
		return getControl('input:list',options);
	},
	
	action : function(decoratorName,options) {
		options=getOptions(arguments,'button');
		return getControl('input:action',options);
	},
	
	button : function(decoratorName,options) {
		options=getOptions(arguments,'button');
		return getControl('input:action',options);
	},
	
	submit : function(decoratorName,options) {
		options=getOptions(arguments,'submit');
		options=options || {};		
		return getControl('input:action',options);
	},
	
	panel : function(decoratorName,options) {
		options=getOptions(arguments,'panel');
		return getControl('panel:default',options);
	},
	
	view : function(decoratorName,options) {
		options=getOptions(arguments,'view');
// Try to find a corresponding view, if not just change the layoutname of the default
//		if(options._component!=='view')
//			options.layoutName=options._component.replace(/\./g,'/');
//		options._component='view';
		return getControl('view:default',options);
	},
	
	form: function() {
		var options;
		var control=null;
		var async=function() {
			this._meta.options._syncFromSource=false;
			this._meta.options._syncToSource=false;
			return this;
		};
		var model=function() {
			switch(arguments.length) {
				case 2:
					this._meta.options['_modelName']=arguments[0];
					this._meta.options['for']=arguments[1];
					break;
				case 1:
					if(typeof arguments[0]==='string') {
						this._meta.options['_modelName']=arguments[0];
					} else {
						this._meta.options['for']=arguments[0];
					}
					break;
					
			}
			return this;
		};
		var validation=function(options) {
			if(options['detached']) {
				this._meta.options['_validationDetached']=true;
			}
			return this;
		};
		
		if(arguments.length===1) {
			if(typeof arguments[0]==='string') {
				control= getControl( 'form:'+arguments[0]);
				control.async=async;
				control.for=model;
				control.model=model;
				control.validation=validation;
				return control;
			}
			options=arguments[0];
		}else if(arguments.length===2) {
			if(typeof arguments[1]==='string') {
				control = getControl(arguments[1],{_modelName:arguments[0]});
				control.async=async;
				control.for=model;
				control.model=model;
				control.validation=validation;
				return control;
			}
			options=arguments[1];
			options._modelName=arguments[0];
		} else {
			Ember.assert('The form helper accepts either 1 or 2 arguments');
		}
		return Form.extend(options);
	},
	
	computed : function(depKeys,getset) {
		depKeys=depKeys.split(',');
		for(var i =0;i<depKeys.length;i++) {
			depKeys[i]='_form.'+depKeys[i];			
		}		
		
		return Ember.computed(depKeys.join(','),{
			set:getset.set,
			get : function() {
				var target=this._isForm ? this : this._form;
				depKeys.forEach(function(property) {
					this.get(property);
				},this);
				if(getset.get) {
					return getset.get.apply(target);
				}
				return undefined;
			}
		});
	},
	
	attr: function(key) {
		var meta={
				type: 'form-attr',
				key: '_model.'+key
			};		
		return  Ember.computed.alias(meta.key).meta(meta);
	},
	
	option: function(value,caption,control) {
		return Ember.Object.extend({value:value,caption:caption,control : control ? control : null}).create();
	},
	
});

export default Helpers;