import Ember from "ember";
import Input from 'furnace-forms/components/input';
export default function inputHelper(options) {
	Ember.HTMLBars.helpers.view.helperFunction.call(this,params,hash,options,env);
	
	return Ember.Handlebars.helpers.view.call(this, Lookup.call(this,contextObject),options);	
}
