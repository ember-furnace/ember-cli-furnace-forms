import Conditional from 'furnace-forms/mixins/controls/conditional';
import ValueSupport from 'furnace-forms/mixins/controls/value-support';
import Control from 'furnace-forms/controls/abstract';
import Ember from 'ember';


export default function(props,fn) {
		var _props=props.split(',');
		var length=_props.length;
		var options=this._meta.options;
		
		for(var i =0;i<length;i++) {
			_props[i]='_form.'+_props[i];			
		}

		if(arguments.length===1) {
			options._conditionFn=function() {
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
			};
		}
		else {
			options._conditionFn=function() {	
				this.get('conditionProperties').forEach(function(property) {
					this.get(property);
				},this);
				if(!this.hasModel()) {
					return false;
				}
				return fn.call(this._form);
			};
		}
		options._conditionProps=_props.join(',');
		options._mixin.conditional=Conditional;
		return this;
	}