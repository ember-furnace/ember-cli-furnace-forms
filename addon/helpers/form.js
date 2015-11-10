import Ember from 'ember';
import Lookup from 'furnace-forms/utils/lookup-class';

var require = Ember.__loader.require;
var registerKeyword = require('ember-htmlbars/keywords').registerKeyword;
var componentKeyword = require('ember-htmlbars/keywords/component').default;
var assign = require('ember-metal/merge').assign;
var formKeyWord = {
	setupState(lastState, env, scope, params, hash) {
		let controller=scope.locals.controller.value();
		let view=env.view;
		let named=null;
		
		var forObject = null;
		if(hash['for']) {
			forObject=env.hooks.getValue(hash['for']);
		}
		else {
			forObject=controller;
		}
		
		if(params[0]) {
			if(typeof params[0]==='string') {
				named=params[0];			
			}
		} else {
//			Ember.warn('Check if renderedName still works');
//			named=view.get('renderedName');
		}	
		
		var controlClass=Lookup.call(view,named ? named :controller);
		var control=controlClass.createWithMixins({container:view.container,target:controller,
			'for' : Ember.computed({
				get : function() {
					return forObject;
				},
				set : function(key,value) {
					return value;
				}
			})
		});
		hash.control=control;
		let componentPath = control.get('decorator');//'form:'+named;
		return assign({}, lastState, { componentPath, isComponentHelper: true });
	},

	render: componentKeyword.render,

	rerender: componentKeyword.renderer
};

export default function() {
	registerKeyword('form',formKeyWord);
}

