import Lookup from 'furnace-forms/utils/lookup-class';
import RegisterFormHelper from 'furnace-forms/helpers/form';
import RegisterControlHelper from 'furnace-forms/helpers/control';
//import ControlHelper from 'furnace-forms/helpers/control';
//import MessagesHelper from 'furnace-forms/helpers/messages';

import Forms from 'furnace-forms';

import Ember from 'ember';


export function initialize(container, application) {
	
	application.register('form:lookup',Lookup, {instantiate:false});
	
	
	application.register('control:form',Forms.Controls.Form);
	application.register('control:panel',Forms.Controls.Panel);
	application.register('control:input',Forms.Controls.Input);
	application.register('control:list',Forms.Controls.List);
	application.register('control:action',Forms.Controls.Action);
	application.register('control:view',Forms.Controls.View);
	
	application.register('forms:form',Forms.Components.Form);
	application.register('forms:panel',Forms.Components.Panel);
	application.register('forms:condition',Forms.Components.Condition);
	application.register('forms:view',Forms.Components.View);
	
	application.register('input:text',Forms.Inputs.Text);
	application.register('input:number',Forms.Inputs.Number);
	application.register('input:textarea',Forms.Inputs.TextArea);

	application.register('input:button',Forms.Inputs.Button);
	application.register('input:select',Forms.Inputs.Select);
	application.register('input:password',Forms.Inputs.Password);
	application.register('input:checkbox',Forms.Inputs.Checkbox);
	
	application.register('input:list',Forms.Inputs.List);
	
	application.register('input:radio',Forms.Inputs.RadioList);
	application.register('input:radio-option',Forms.Inputs.RadioOption);
	
	application.register('input:check',Forms.Inputs.CheckList);
	application.register('input:check-option',Forms.Inputs.CheckOption);
	
	application.register('input:submit',Forms.Inputs.Submit);
	application.register('component:form-messages',Forms.Components.Messages);
	application.register('component:f-messages',Forms.Components.Messages);
	
	application.inject('route','formFor','form:lookup');
	application.inject('model','formFor','form:lookup');
	application.inject('controller','formFor','form:lookup');
	
	Ember.ComponentLookup.reopen({
		componentFor: function(name,container) {
			if(name.indexOf(':')>-1) {
				var factory= container.lookupFactory(name);
				if(factory && !factory.typeKey) {
					name=name.substring(name.indexOf(':')+1);
					factory.typeKey=name;
				}
				return factory;
			}
			return this._super(name,container);
		},
		layoutFor : function(name,container) {
			if(name.indexOf(':')>-1) {
				name=name.substring(name.indexOf(':')+1);
				return container.lookupFactory('template:'+name);
			}
			return this._super(name,container);
		}
	});
	
	RegisterFormHelper();
	RegisterControlHelper();
};

export default {
	name: 'furnace-forms',
	initialize: initialize
};
