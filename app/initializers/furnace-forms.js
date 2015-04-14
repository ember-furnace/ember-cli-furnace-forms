import Lookup from 'furnace-forms/utils/lookup-class';
import FormHelper from 'furnace-forms/helpers/form';
import CompatFormHelper from 'furnace-forms/compat/helpers/form';
import ControlHelper from 'furnace-forms/helpers/control';
import I18nDummyHelper from 'furnace-forms/helpers/i18n';
import CompatInputHelper from 'furnace-forms/compat/helpers/input';

import Forms from 'furnace-forms';

import Ember from 'ember';


export function initialize(container, application) {
	application.register('form:lookup',Lookup, {instantiate:false});
	
	application.register('input:text',Forms.Text);
	application.register('input:textarea',Forms.Textarea);
	application.register('input:password',Forms.Password);
	application.register('input:select',Forms.Select);
	application.register('input:action',Forms.Action);
	application.register('input:submit',Forms.Submit);
	application.register('input:panel',Forms.Panel);
	application.register('input:condition',Forms.Condition);
	
	application.inject('route','formFor','form:lookup');
	application.inject('model','formFor','form:lookup');
	application.inject('controller','formFor','form:lookup');
	if(Ember.HTMLBars) {
		Ember.HTMLBars._registerHelper('form',FormHelper);
		Ember.HTMLBars._registerHelper('f-control',ControlHelper);
		 
	}
	else {
		Ember.Handlebars.registerHelper('form',CompatFormHelper);
		Ember.Handlebars.registerHelper('finput',CompatInputHelper);
	}
};

export default {
	name: 'furnace-forms',
	initialize: initialize
};
