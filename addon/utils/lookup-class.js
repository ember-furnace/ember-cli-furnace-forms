import Ember from 'ember';
import getName from './get-name';
import Form from 'furnace-forms/components/form';
var Cache={classes : {},instances:{}};

var getClass=function(container,name) {
	var Class=Cache.classes[name];
	if(!Class) {
		Class = container.lookupFactory('form:'+name);
		
		Ember.assert('No form defined for name "'+name+'"',Class);
		
		Cache.classes[name]=Class;
	}
	return Class;
};


export default function(object,options) {
	if(object===undefined || object===null)
		object=this;
	var container=this.get('container');
	var name=getName(object);
	return getClass(container,name);
}
	