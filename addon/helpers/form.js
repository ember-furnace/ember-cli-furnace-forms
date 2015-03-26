/**
 * @module furnace
 * @submodule furnace-forms
 */
import Ember from "ember";
import Lookup from 'furnace-forms/utils/lookup-class';

/**
 * @method form
 * @for Furnace.Forms.helpers
 * @param {Furnace.Forms.Control.Form} Form Control Proxy
 * @param {Hash} options
 * @return {String} HTML string  
 */
export default function formHelper(params, hash, options, env) {	
	var contextObject=hash['for'] ? hash['for'].value() : null;
	Ember.assert("You are required to specify a form or the 'for' attribute",params[0] || contextObject);
	if(!contextObject) {
		contextObject=params[0];
		hash['for']=this;
	}
	var component=Lookup.call(this,params[0] ? params[0] :contextObject);
	return env.helpers.view.helperFunction.call(this,[component],hash,options,env);
}
