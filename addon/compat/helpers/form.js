import Ember from "ember";
import Lookup from 'furnace-forms/utils/lookup-class';
export default function formHelper(options) {
	var contextName=options.hash['for'];
	Ember.assert("You are required to specify the 'for' attribute",contextName);
	var contextObject=this.get(contextName);
	return Ember.Handlebars.helpers.view.call(this, Lookup.call(this,contextObject),options);		
}
