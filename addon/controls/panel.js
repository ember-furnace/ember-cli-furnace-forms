import Control from './abstract';
import Component from 'furnace-forms/components/panel';

export default Control.extend().reopenClass({
	_component : Component,
	
	generate : function(options) {
		options=options || {};	
		
		options['for']=options._panel['for'];
		if(options['for'].get(options._name)) {
			options['for']=options['for'].get(options._name);
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