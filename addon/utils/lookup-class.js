import Ember from 'ember';
import getName from './get-name';
var Cache={classes : {},instances:{}};

var getClass=function(container,type,name) {
	if(type===undefined)
		type='form';
		
	var Class=Cache.classes[type+":"+name];
	if(!Class) {
		Class = container.lookupFactory(type+':'+name);
		Ember.assert('No '+type+' defined for name "'+name+'"',Class);
		Class.typeKey=name;
		Cache.classes[type+':'+name]=Class;
	}
	return Class;
};


export default function(object,type) {	
	var name=null;	
	if(typeof object==='string') {
		name=object;
	}
	else {
		if(object===undefined || object===null)
			object=this;
		name=getName(object);
	}
	var container=this.container;
	return getClass(container,type,name);
}
	