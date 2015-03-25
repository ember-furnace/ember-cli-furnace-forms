import Ember from 'ember';
import PanelComponent from 'furnace-forms/components/panel';
export default function(object,silent) {
	var objectName=null;
	if(typeof object === 'string') {
		objectName=object;
	}
	else if(object instanceof Ember.Route) {
		objectName=object.routeName;
	}
	else if(Ember.ControllerMixin.detect(object)) {
		var tmpName = object.constructor.toString();
		var index=tmpName.indexOf(':');
		objectName=tmpName.substring(index+1,tmpName.indexOf(':',index+1)).replace(/\//g,'.');	
	} else if(object instanceof PanelComponent) {
		console.log(object.constructor);
		Ember.debug(object.constructor);
		objectName=object.get('layoutName');
	} else if(object instanceof Ember.Component) {		
		objectName=object.get('layoutName');
	} else if(object instanceof Ember.Object) {
		objectName=object.constructor.typeKey;
	} else {
		Ember.warn('Can not determine form for type '+(typeof object));
	}

	if(!silent)
		Ember.warn('Unable to determine form for type '+(typeof object),objectName);
	
	return objectName;
};