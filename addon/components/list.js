/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Ember from 'ember';
import InputComponent from 'furnace-forms/components/input';
import getName from 'furnace-forms/utils/get-name';
import Options from 'furnace-forms/mixins/options';
import ControlSupport from 'furnace-forms/mixins/control-support';

import Input from 'furnace-forms/controls/input';
/**
 * Text input control component
 * 
 * @class Radio
 * @namespace Furnace.Forms.Components
 * @extends Furnace.Forms.Components.Input
 */
export default InputComponent.extend(ControlSupport,Options,{
	
	attributeBindings: ['type'],
	
	actions : {
		select: function(index) {
			this.set('value',this.get('_options')[index].value);
		}
	},
	
	optionType : null,
	
	name : Ember.computed.alias('_name'),
		
	controls: Ember.computed('_options',function() {
		var ret = Ember.A();
		var control = this;
		this.get('_options').forEach(function(option,index) {
			ret.pushObject(Input.create({_component:control.optionType,
										 _name:control._name,
										 _form:control._form,
										 _panel:control,
										 index : index,
										 option : option}));
		});
		return ret;
	}).readOnly(),
	

	type : Ember.computed(function() {
		return Ember.String.camelize(this.constructor.typeKey);
	}),
	
});