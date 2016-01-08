import Form from 'furnace-forms/controls/form';
import Lookup from 'furnace-forms/utils/lookup-class';
import Ember from 'ember';
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
			
			return type.extend.apply(type,mixins).create(options);
		} else {		
			try {
				return type.create(options);
			}
			catch(e) {
				Ember.assert('Could not create control '+type+':'+name+' '+e);
			}
		}
	} 
}