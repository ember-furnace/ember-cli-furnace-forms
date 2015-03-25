import Control from './abstract';
import Component from 'furnace-forms/components/panel';
import Ember from 'ember';

export default Control.extend().reopenClass({
	_component : Component,
	
	generate : function(options) {
		options=options || {};	
		
		if(options._panel['for'].get(options._name)) {
			options['for']=Ember.computed.alias('_panel.for.'+options._name);
		} else {
			options['for']=Ember.computed.alias('_panel.for');
		}
		var _options={
			_name: options._name,
			_panel: options._panel,
			_form: options._form,
			_component: this._component.extend(options)
		};
		return this.extend(_options).create();
	}
});