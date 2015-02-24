import Ember from "ember";
import Lookup from 'furnace-forms/utils/lookup-class';
export default function formHelper(params, hash, options, env) {
	var contextObject=hash['for'].value();
	Ember.assert("You are required to specify the 'for' attribute",contextObject);
	var component=Lookup.call(this,this.get('_controller'));
	return env.helpers.view.helperFunction.call(this,[component],hash,options,env);
}
