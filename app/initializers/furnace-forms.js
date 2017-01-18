import LookupClass from 'furnace-forms/utils/lookup-class';
import LookupProxy from 'furnace-forms/utils/lookup-proxy';
import FurnaceFormComponent from 'furnace-forms/helpers/furnace-form';

import Forms from 'furnace-forms';

import Ember from 'ember';

export function initialize(application) {
	
	application.register('form:-lookup',LookupClass, {instantiate:false});
	
	application.register('form:default',Forms.Controls.Form);
	application.register('panel:default',Forms.Controls.Panel);
	application.register('input:default',Forms.Controls.Input);
	application.register('input:list',Forms.Controls.List);
	application.register('input:action',Forms.Controls.Action);
	application.register('input:number',Forms.Controls.Number);
	application.register('input:options',Forms.Controls.Options);
	application.register('view:default',Forms.Controls.View);
	
	application.register('component:furnace-form',FurnaceFormComponent);
	application.register('component:form.form-decorator',Forms.Components.Form);
	application.register('component:panel.panel-decorator',Forms.Components.Panel);
	application.register('component:condition.panel-decorator',Forms.Components.Condition);
	application.register('component:view.view-decorator',Forms.Components.View);
	application.register('component:input.input-decorator',Forms.Components.Input);
	
	application.register('component:text.input-decorator',Forms.Inputs.Text);
	application.register('component:number.input-decorator',Forms.Inputs.Number);
	application.register('component:textarea.input-decorator',Forms.Inputs.TextArea);

	application.register('component:button.input-decorator',Forms.Inputs.Button);
	application.register('component:select.input-decorator',Forms.Inputs.Select);
	application.register('component:password.input-decorator',Forms.Inputs.Password);
	application.register('component:checkbox.input-decorator',Forms.Inputs.Checkbox);
	
	application.register('component:list.input-decorator',Forms.Inputs.List);
	
	application.register('component:radio.input-decorator',Forms.Inputs.RadioList);
	application.register('component:radio-option.input-decorator',Forms.Inputs.RadioOption);
	
	application.register('component:checklist.input-decorator',Forms.Inputs.CheckList);
	application.register('component:checklist-option.input-decorator',Forms.Inputs.CheckOption);
	
	application.register('component:submit.input-decorator',Forms.Inputs.Submit);
	application.register('component:furnace-form-messages',Forms.Components.Messages);
	application.register('component:f-messages',Forms.Components.Messages);
	
	application.register('form-model-proxy:default',Forms.Proxy);
	application.register('form-model-proxy:-lookup',LookupProxy,{instantiate:false});
	
	application.inject('route','formFor','form:-lookup');
	application.inject('model','formFor','form:-lookup');
	application.inject('controller','formFor','form:-lookup');
	
	application.inject('route','modelProxyFor','form-model-proxy:-lookup');
	application.inject('model','modelProxyFor','form-model-proxy:-lookup');
	application.inject('controller','modelProxyFor','form-model-proxy:-lookup');
	
//	Ember.ComponentLookup.reopen({
//		componentFor: function(name,container) {
//			if(name.indexOf(':')>-1) {
//				var factory= container.lookupFactory(name);
//				if(factory && !factory.typeKey) {
//					name=name.substring(name.indexOf(':')+1);
//					factory.typeKey=name;
//				}
//				return factory;
//			}
//			return this._super(name,container);
//		},
//		layoutFor : function(name,container) {
//			if(name.indexOf(':')>-1) {
//				name=name.substring(name.indexOf(':')+1);
//				return container.lookupFactory('template:'+name);
//			}
//			return this._super(name,container);
//		}
//	});
	
};

export default {
	name: 'furnace-forms',
	initialize: initialize
};
