import Ember from 'ember';
import ControlSupport from 'furnace-forms/mixins/controls/control-support';
import OptionsSupport from 'furnace-forms/mixins/controls/options-support';
import SingleSelect from 'furnace-forms/mixins/controls/single-select';
import MultiSelect from 'furnace-forms/mixins/controls/multi-select';

function singleSelect() {
	this._meta.options._mixin.optionsType=SingleSelect;
	return this;
};

function multiSelect() {
	this._meta.options._mixin.optionsType=MultiSelect;
	return this;
};

export {
	singleSelect,
	multiSelect
};


export default function inputOptions() {
	if(this instanceof Ember.ComputedProperty) {
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
		
		// TODO: consider deprecating single and multiple
		this.multiple=multiSelect;
		this.single=singleSelect;
		
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
		this._meta.options._optionsStatic=true;
	} else {
		this.reopenClass({
			on : function(props) {		
				var _props=props.split(',');
				var length=_props.length;
				for(var i =0;i<length;i++) {
					_props[i]='_form.'+_props[i];			
				}
				this.reopen({
					_optionProps:_props.join(',')
				});
				return this;
			},
			// TODO: consider deprecating single and multiple
			multiple: function() {				
				return this.reopen(MultiSelect);
			},
			single: function() {				
				return this.reopen(SingleSelect);
			},
			multiSelect: function() {				
				return this.reopen(MultiSelect);
			},
			singleSelect: function() {				
				return this.reopen(SingleSelect);
			}
		})
		
		var attrs={};
		
		if(arguments.length===1 && typeof arguments[0] ==='function') {
			attrs._optionFn=arguments[0];
		} else if(arguments.length===1 && typeof arguments[0]==='string') {
			var prop=arguments[0];
			attrs._optionFn = function() {
				return this.getTarget().get(prop);
			};				
		} else {
			var options=Ember.A();
			for(var i=0;i<arguments.length;i++) {
				options.push(arguments[i]);
			}
			attrs._optionFn=function() {
				return options;
			};
			attrs._optionsStatic=true;
		}		
		this.reopen(attrs);				
	}
	return this;
}