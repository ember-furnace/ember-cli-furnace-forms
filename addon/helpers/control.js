import Ember from "ember";
import getName from 'furnace-forms/utils/get-name';

export default function controlHelper(params, hash, options, env) {
	Ember.assert('You need to specify a control from your form',params[0]);
	
	var control =params[0].value();
	Ember.assert('Control not found',control);

	var component = control.getComponentClass(this,control._panel.get('_modelName'));
	
	Ember.assert('Control does not specify a component',component);
	hash=control.extendHash(hash);
	env.helpers.view.helperFunction.call(this,[component],hash,options,env);
}
