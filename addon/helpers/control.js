import Ember from 'ember';

var require = Ember.__loader.require;
var registerKeyword = require('ember-htmlbars/keywords').registerKeyword;
var componentKeyword = require('ember-htmlbars/keywords/component').default;
var assign = require('ember-metal/merge').assign;
var controlKeyWord = {
	setupState(lastState, env, scope, params, hash) {
		var control=env.hooks.getValue(params[0]);
		if(!control._component) {			
			control._component=env.view.optionType;
		}		
		let componentPath = control.get('decorator');
		hash.control=control;		
		return assign({}, lastState, { componentPath, isComponentHelper: true });
	},

	render: componentKeyword.render,

	rerender: componentKeyword.renderer
};

export default function() {
	registerKeyword('f-control',controlKeyWord);
	registerKeyword('form-control',controlKeyWord);
}

