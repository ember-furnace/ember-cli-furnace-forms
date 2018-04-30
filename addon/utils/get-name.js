import Ember from 'ember';
import Panel from 'furnace-forms/controls/panel';
import { ProxyMixin } from 'furnace-forms/proxy';

function getObjectName(object) {
	var objectName=null;
	if(object.constructor.modelName!==undefined) {
		objectName=object.constructor.modelName;
	} else if(object.constructor.typeKey!==undefined) {
		objectName=object.constructor.typeKey;
	} else {
		var tmpName = object.constructor.toString();
		var index=tmpName.indexOf(':');
		objectName=tmpName.substring(index+1,tmpName.indexOf(':',index+1)).replace(/\//g,'.');
	}
	return objectName;
}

export default function(object,silent) {
	var objectName=null;
	if(typeof object === 'string') {
		objectName=object;
	}
	else if(object instanceof Ember.Route) {
		objectName=object.routeName;
	}
	else if(Ember.ControllerMixin.detect(object)) {
		var tmpName = object.toString();
		var index=tmpName.indexOf(':');
		objectName=tmpName.substring(index+1,tmpName.indexOf(':',index+1)).replace(/\//g,'.');	
	} else if(object instanceof Panel) {
		objectName=object.get('layoutName');
	} else if(object instanceof Ember.Component) {
		objectName=object.get('layoutName').replace(/\//g,'.');
	} else if(object instanceof Ember.Object) {
		// FIXME: We might want to punch through a proxy proxying another proxy
		if(ProxyMixin.detect(object) && object.get('_content')) {
			objectName=getObjectName(object.get('_content'));
		}
		if(objectName===null) {
			objectName=getObjectName(object);
		}
	}
//	else {
//		Ember.warn('Can not determine form for type '+(typeof object));
//		console.trace();
//	}

	if(!silent) {
		Ember.warn('Unable to determine form for type '+(typeof object),objectName,{id:'furnace-forms:name-lookup'});
	}
	return objectName;
}