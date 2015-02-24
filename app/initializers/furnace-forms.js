import Lookup from 'furnace-forms/utils/lookup-class';
import FormHelper from 'furnace-forms/helpers/form';
import CompatFormHelper from 'furnace-forms/compat/helpers/form';
import ControlHelper from 'furnace-forms/helpers/control';
import CompatInputHelper from 'furnace-forms/compat/helpers/input';
import { setContainer } from 'furnace-forms/utils/i18n';
import Ember from 'ember';


export function initialize(container, application) {
	setContainer(container);
	application.register('form:lookup',Lookup, {instantiate:false});
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
