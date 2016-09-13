import getName from './get-name';
import { ProxyMixin } from 'furnace-forms/proxy';
export default function(object,defaults,options) {
	options=options || {};
	var name=null;	
	var type=null;
	if(typeof object==='string') {
		var _name=object.split(':',2);
		if(_name.length===2) {
			type=_name[0];
			name=_name[1];
		} else {
			name=_name[0];			
		}
		object=null;
	} else {
		if(object===undefined || object===null) {
			object=this;
		}
		name=getName(object,true);
	}
	var container=this.container;	
	var Class = container.lookupFactory('form-model-proxy:'+name);
	if(!Class) {
		Class= container.lookupFactory('form-model-proxy:default');
	}
	var _options={
		container: container,
		_modelType: type,
		_modelName: name,
		_content: object,
		_syncFromSource: options.fromSource || false,
		_syncToSource: options.toSource || false	
	};
	if(ProxyMixin.detect(this)) {
		_options._top=this._top || this;
	}	
	
	var proxy = Class.create(_options); 
	if(defaults) {
		proxy.setProperties(defaults);
	}
	return proxy;
}