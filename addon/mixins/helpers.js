import Ember from 'ember';
import Control from 'furnace-forms/controls/abstract';
import Input from 'furnace-forms/controls/input'; 
import Action from 'furnace-forms/controls/action'; 
import Panel from 'furnace-forms/controls/panel'; 
import View from 'furnace-forms/controls/view'; 
import Form from 'furnace-forms/controls/form';
import FormComponent from 'furnace-forms/components/form';
import Lookup from 'furnace-forms/utils/lookup-class';



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



var getControl=function(type,options) {
	return computedControl(type,options);
};

var Helpers= Ember.Mixin.create({
	
	control : function(control,options) {
		options=getOptions(arguments);
		return getControl('control:'+control,options);
	},
	
	input : function(decoratorName,options) {
		options=getOptions(arguments,'text');
		return getControl('control:input',options);
	},
	
	list : function(decoratorName,options) {
		options=getOptions(arguments,'list');
		return getControl('control:list',options);
	},
	
	action : function(decoratorName,options) {
		options=getOptions(arguments,'button');
		return getControl('control:action',options);
	},
	
	submit : function(decoratorName,options) {
		options=getOptions(arguments,'submit');
		options=options || {};		
		return getControl('control:action',options);
	},
	
	panel : function(decoratorName,options) {
		options=getOptions(arguments,'panel');
		return getControl('control:panel',options);
	},
	
	view : function(decoratorName,options) {
		options=getOptions(arguments,'view');
// Try to find a corresponding view, if not just change the layoutname of the default
//		if(options._component!=='view')
//			options.layoutName=options._component.replace(/\./g,'/');
//		options._component='view';
		return getControl('control:view',options);
	},
	
	form: function() {
		var options;
		var control=null;
		var async=function() {
			this._meta.options._syncFromSource=false;
			this._meta.options._syncToSource=false;
			return this;
		}
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
		}
		
		
		if(arguments.length===1) {
			if(typeof arguments[0]==='string') {
				control= getControl( 'form:'+arguments[0]);
				control.async=async;
				control.for=model;
				control.model=model;
				return control;
			}
			options=arguments[0];
		}else if(arguments.length===2) {
			if(typeof arguments[1]==='string') {
				control = getControl(arguments[1],{_modelName:arguments[0]});
				control.async=async;
				control.for=model;
				control.model=model;
				return control;
			}
			options=arguments[1];
			options._modelName=arguments[0];
		} else {
			Ember.assert('The form helper accepts either 1 or 2 arguments');
		}
		return Form.extend(options);
	},
	
	attr: function(key) {
		var meta={
				type: 'form-attr',
				key: 'for.'+key
			};		
		return  Ember.computed.alias(meta.key).meta(meta);
//				function(key,value) {
//			var meta = this.constructor.metaForProperty(key);
//			console.log(key,this.get(meta.key));
//			if(this.get(meta.key)===undefined) {
//				var _key=key;
//				this.addObserver(meta.key,this,function(sender,key){
//					this.notifyPropertyChange(_key);
//				});
//				return value;
//			}
//			if(value!==undefined) {
//				this.set(meta.key,value);
//			}
//			return this.get(meta.key);
//		}).meta(meta);
	},
	
	option: function(value,caption,control) {
		return Ember.Object.extend({value:value,caption:caption,control : control ? control : null}).create();
	}
});

export default Helpers;