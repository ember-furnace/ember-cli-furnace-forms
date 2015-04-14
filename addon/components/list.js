/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Ember from 'ember';
import PanelComponent from 'furnace-forms/components/panel';
import getName from 'furnace-forms/utils/get-name';
import Options from 'furnace-forms/mixins/options';

import Input from 'furnace-forms/controls/input';
/**
 * Text input control component
 * 
 * @class Radio
 * @namespace Furnace.Forms.Components
 * @extends Furnace.Forms.Components.Input
 */
export default PanelComponent.extend(Options,{
	tagName : 'control',
	
	actions : {
		select: function(index) {
			this.set('value',this._options[index].value);
		}
	},
	
	optionClass : null,
	
	name : Ember.computed.alias('_name'),
		
	controls: Ember.computed(function() {
		var ret = Ember.A();
		var control = this;
		this._options.forEach(function(option,index) {
			ret.pushObject(Input.create({_component:control.optionClass,
										 _name:control._name,
										 _form:control._form,
										 _panel:control,
										 index : index,
										 value : option.value,
										 caption : option.caption,
										 form : option.form===true ? getName(option.value) : option.form}));
		})
		return ret;
	}).readOnly(),
	

	
	
});