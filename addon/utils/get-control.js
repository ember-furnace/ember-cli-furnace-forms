import Form from 'furnace-forms/controls/form';
import Lookup from 'furnace-forms/utils/lookup-class';
export default function getControl(name,type,options) {
	options=options || {};
	options._name=name;
	if(this instanceof Form) {
		options._form=this;
	}
	else {				
		options._form=this._form;
	}
	
	options._panel=this;
	options.container=this.container;
	if(typeof type==='string') {
		var _type = type.split(':');
		type=Lookup.call(this,_type[1],_type[0]);				
		Ember.assert('No control for type '+_type.join(':'),type);
	}
	var mixins=[];
	for(var index in options._mixin) {
		mixins.push(options._mixin[index]);
	}
	if(typeof type.generate==='function') {
		return type.generate(mixins,options).create();			
	}
	else {
		if(mixins.length) {
			mixins.push(options);
			return type.createWithMixins.apply(type,mixins);
		} else {			
			return type.create(options);
		}
	} 
}