import Conditional from 'furnace-forms/mixins/controls/conditional';
import ValueSupport from 'furnace-forms/mixins/controls/value-support';
import Control from 'furnace-forms/controls/abstract';
import Ember from 'ember';

function defaultCondition() {
	if(!this.hasModel()) {
		return false;
	}
	var props=this._conditionProps.split(',');
	for(var i=0; i<props.length;i++) {
		var prop=this.get(props[i]);
		if(prop instanceof Control) {
			Ember.warn('Condition check on control "'+props[i]+'" but the control is not available (yet)!',prop.content!==null,{id:'furnace-forms.conditions-control-initializing'});
			if(Conditional.detect(prop) && prop.get('hasPrerequisites') ===false) {
				return false;
			} else if(ValueSupport.detect(prop) && !prop.get('value') ){
				return false;
			} else if( prop.get('isValid')===false) {
				return false;
			}
		} else if(prop === undefined) {
			// lets check if the property exists in our target model
			var path=props[i].replace(/^_form./,'');
			if(!this.getFor(path)) {
				return false;
			}
		} else if(!prop) {
			return false;						
		}					
	}
	return true;
}


function getProps(props) {
	props=props.split(',');
	var length=props.length;
	for(var i =0;i<length;i++) {
		if(!props[i]) {
			delete props[i];
		} else if(props[i].indexOf('@this.')===0){
			props[i]=props[i].substring(6);
		} else if(props[i].indexOf('@panel.')===0){
			props[i]='_panel.'+props[i].substring(7);
		} else {
			props[i]='_form.'+props[i];
		}
	}
	return props;
}
export {
	defaultCondition,
	getProps
};

export default function(props,fn) {
	var options=this._meta.options;
	props=getProps(props);

	if(arguments.length===1) {
		options._conditionFn=defaultCondition;
	}
	else {
		options._conditionFn=function customCondition() {	
			this.get('conditionProperties').forEach(function(property) {
				this.get(property);
			},this);
			if(!this.hasModel()) {
				return false;
			}
			return fn.call(this._form,this,ValueSupport.detect(this) ? this.get('value') : this.get('_panel._model'));
		};
	}
	options._conditionProps=props.join(',');
	options._mixin.conditional=Conditional;
	return this;
}