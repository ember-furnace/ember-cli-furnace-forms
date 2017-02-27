import Form from 'furnace-forms/controls/form';
import Lookup from 'furnace-forms/utils/lookup-class';
import Ember from 'ember';
export default function getControl(name,meta,options) {
	meta=meta || {};
	options=options || {};
	
	var type=meta.options._controlType;
	
	options._name=name;
	if(this instanceof Form) {
		options._form=this;
	}
	else {				
		options._form=this._form;
	}
	
	options._panel=this;
	var owner =Ember.getOwner(this);
	
	if(typeof type==='string') {
		var _type = type.split(':');
		type=Lookup.call(this,_type[1],_type[0]);				
		Ember.assert('No control for type '+_type.join(':'),type);
	}
	var mixins=[];
	for(var index in meta.options._mixin) {
		mixins.push(meta.options._mixin[index]);
	}
	if(typeof type.generate==='function') {
		return type.generate(mixins,meta,options).create(owner.ownerInjection(),options);			
	}
	else {
		if(mixins.length) {			
			let extend= type.extend.apply(type,mixins);
			extend.typeKey=type.typeKey;
			return extend.create(owner.ownerInjection(),meta.options,options);
		} else {		
			try {
				return type.create(owner.ownerInjection(),meta.options,options);
			}
			catch(e) {
				Ember.assert('Could not create control '+type+':'+name+' '+e);
			}
		}
	} 
}