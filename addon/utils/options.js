import ControlSupport from 'furnace-forms/mixins/controls/control-support';
import OptionsSupport from 'furnace-forms/mixins/controls/options-support';
import SingleSelect from 'furnace-forms/mixins/controls/single-select';
import MultiSelect from 'furnace-forms/mixins/controls/multi-select';
export default function inputOptions() {
	this._meta.options._mixin.controlSupport=ControlSupport;
	this._meta.options._mixin.optionsSupport=OptionsSupport;
	this._meta.options._mixin.optionsType=SingleSelect;
	
	this.on=function(props) {		
		var _props=props.split(',');
		var length=_props.length;
		for(var i =0;i<length;i++) {
			_props[i]='_form.'+_props[i];			
		}
		this._meta.options._optionProps=_props.join(',');
		return this;
	}
	this.multiple=function() {
		this._meta.options._mixin.optionsType=MultiSelect;
		return this;
	}
	
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
	this._meta.options._optionFn=function() {
		return options;
	}
	
	return this;
}