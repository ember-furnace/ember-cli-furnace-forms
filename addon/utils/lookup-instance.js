import Ember from 'ember';
import getName from './get-name';
var Cache={classes : {},instances:{}};

//
//if (get(instance, 'namespace.LOG_ACTIVE_GENERATION')) {
//    Ember.Logger.info("generated -> " + fullName, { fullName: fullName });
//  }

var getClass=function(container,name) {
	var Class=Cache.classes[name];
	if(!Class) {
		Class = container.lookupFactory('form:'+name);
		Ember.assert('No form for '+name,Class);
		Cache.classes[name]=Class;
	}
	return Class;
};

var getInstance=function(container,name,options) {
	var Instance,Class=getClass(container,name);

	// If we get options, the form is uniquely configured for its context so create a new instance
	if(options) {
		 Instance=Class.create(options);
	} else {
		Instance=Cache.instances[name];
		if(!Instance) {
			Instance=Class.create();
			Cache.instances[name]=Instance;
		}		
	}
	return Instance;
};



export default function(object,options) {
	if(object===undefined) {
		object=this;
	}
	var container=this.get('container');
	var name=getName(container,object);
	return getInstance(container,name,options);
}
	