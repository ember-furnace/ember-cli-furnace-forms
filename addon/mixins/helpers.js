import Ember from 'ember';
import Control from 'furnace-forms/controls/abstract';
import Input from 'furnace-forms/controls/input'; 
import List from 'furnace-forms/controls/list'; 
import Action from 'furnace-forms/controls/action'; 
import Panel from 'furnace-forms/controls/panel'; 
import Form from 'furnace-forms/controls/form'; 
import PanelComponent from 'furnace-forms/components/panel';
import FormComponent from 'furnace-forms/components/form';
import InputComponent from 'furnace-forms/components/input';
import Lookup from 'furnace-forms/utils/lookup-class';


import Option from 'furnace-forms/controls/option';

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
		options=args[1]
	}		
	options._component = type;
	return options;
}

function inputOptions() {
	if(arguments.length===1) {
		if(typeof arguments[0] ==='function') {
			this._meta.options._optionFn=arguments[0];
			return this;
		} else if(typeof arguments[0]==='string') {
			var prop=arguments[0];
			this._meta.options._optionFn=function() {
				return this.getTarget().get(prop);
			};
			return this;
		}
	}
	
	var options=Ember.A();
	for(var i=0;i<arguments.length;i++) {
		options.push(arguments[i]);
	}
	this._meta.options._options=options;
	
	return this;
}

var getControl=function(type,options) {
	return computedControl(type,options);
};

var Helpers= Ember.Mixin.create({
	list : function(type,options) {
		options=getOptions(arguments,'select');				
		var cp=getControl(List,options);
		cp.options=inputOptions;
		return cp;
	},
	
	
	
	input : function(type,options) {
		options=getOptions(arguments,'text');
		return getControl(Input,options);
	},
	
	action : function(type,options) {
		options=getOptions(arguments,'action');
		return getControl(Action,options);
	},
	
	submit : function(type,options) {
		options=getOptions(arguments,'submit');
		options=options || {};
		options.submit=true;
		return getControl(Action,options);
	},
	
	panel : function(type,options) {
		options=getOptions(arguments,'panel');
		return getControl(Panel,options);
	},
	
	form: function() {
		var options;
		if(arguments.length===1) {
			if(arguments[0].superclass===FormComponent) {
				return getControl(Form,{'_component': arguments[0]});
			}
			else if(typeof arguments[0]==='string') {
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
	},
	
	attr: function(key) {
		var meta={
				type: 'form-attr',
				key:key
			};
		return  Ember.computed(function(key,value) {
			var meta = this.constructor.metaForProperty(key);
			
			if(this.get(meta.key)===undefined) {
				var _key=key;
				this.addObserver(meta.key,this,function(sender,key){
					this.notifyPropertyChange(_key);
				});
				return value;
			}
			if(value!==undefined) {
				this.set(meta.key,value);
			}
			return this.get(meta.key);
		}).meta(meta);
	},
	
	option: function(value,caption,form) {
		return Option.create({value:value,caption:caption,form: form});
	}
});


export default Helpers;