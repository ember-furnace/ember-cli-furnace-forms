import Ember from 'ember';
import lookupProxy from 'furnace-forms/utils/lookup-proxy';
import DS from 'ember-data';

function applyProxy(proxy,refs) {
	if(!ProxyMixin.detect(proxy) || refs.includes(proxy)) {
		return false;
	}
	refs.pushObject(proxy);
	var changes=Ember.A();
	var key;
	
	if(!proxy._syncToSource) {
		var _content=proxy._content;
		if(_content instanceof DS.Model && _content.get('currentState.stateName')==='root.deleted.saved') {
			proxy._modelType='model';
			if(!proxy._modelName) {
				proxy._modelName=_content.modelName || _content.constructor.modelName;
			}
			_content=null;
		}
		if(!_content) {
			if(proxy._canInstantiate) {
			
				Ember.assert('Form proxy requires a modelType and modelName to instantiate content object on apply',proxy._modelType && proxy._modelName);
				if(proxy._modelType==='model') {
					var store=Ember.getOwner(proxy).lookup('service:store');
					_content=store.createRecord(proxy._modelName);
				} else {
					_content=Ember.getOwner(proxy).lookup(proxy._modelType +":"+ proxy._modelName);
				}
				// We need to set our content so dependent children can apply it too
				proxy._pendingContent=_content;
				for(key in proxy._proxies) {
					var child=proxy._proxies[key];
					if(ProxyArrayMixin.detect(child) && child._content===null) {
						child._initialContent(_content.get(key));
					}
				}
				proxy._updateRef(proxy,_content);
			}
		}	
		var value;
		// First make sure edges are applied
		for(key in proxy._cache) {
			value=proxy._proxies[key] || proxy._cache[key];
			if(Ember.PromiseProxyMixin.detect(value)) {
				value=value.content;
			}
			if(ProxyMixin.detect(value)) {
				if(value._apply(refs)) {
					changes.push(key);
				}
			}
			if(_content) {
				proxy._applyKey(_content,key);
			}						
		}
		// Then apply on the content itself
		if(_content) {
			proxy.beginPropertyChanges();
			for(key in proxy._cache) {
				proxy._applyKey(_content,key);
			}						
			proxy.endPropertyChanges();
		}
		if(changes.length) {
			changes.forEach(function(key) {
				this.notifyPropertyChange(key);
			},proxy);
		}
		if(_content!==proxy._content) {
			proxy._pendingContent=undefined;
			proxy.set('_content',_content);
			return true;
		}		
	}
	return false;
}


//
//function arrayContentMap(item) {
//	if(ProxyMixin.detect(item)) {
//		return item._content;
//	} else if(Ember.Enumerable.detect(item)) {
//		return item.map(arrayContentMap);
//	}
//	return item;
//}

var PromiseObjectProxy=Ember.ObjectProxy.extend(Ember.PromiseProxyMixin);
var PromiseArrayProxy=Ember.ArrayProxy.extend(Ember.PromiseProxyMixin);

var ProxyMixin=Ember.Mixin.create({
	_canInstantiate : true,
	
	_syncFromSource : true,
	
	_syncToSource : true,
	
	_refs: null,
	
	_proxies : null,
	
	_cache : null,
	
	_content : null,
	
	_top : null,
	
	_modelType : null,
	
	_modelName : null,
	
	
	init: function() {
		this._super();
		this._proxies={};
		this._cache={};
		this._registerEvents();
		if(!this._top) {
			this._refs=Ember.A();
			if(this._content) {
				this._refs.pushObject({
					obj: this._content,
					proxy: this,
					reg: Ember.A()
				});
			}
		} else if(this._top) {
			this._refs=this._top._refs;
		}
		if(!this._content && this._modelType==='model') {
			var factory=Ember.getOwner(this).factoryFor(this._modelType+':'+this._modelName).class;
			Ember.get(factory,'relationshipsByName').forEach(function(rel) {
				if(rel.kind==='hasMany') {
					var proxy=proxyArray(Ember.getOwner(this),{
						_syncFromSource:this._syncFromSource,
						_syncToSource:this._syncToSource,
						_content:null,						
						_top: this._top || this
					});
					this._proxies[rel.key]=proxy;
					if(rel.options.async===false) {
						this._cache[rel.key]=proxy;
					} else {
						this._cache[rel.key]=new Ember.RSVP.Promise(function(resolve){
							resolve(proxy);
						});
					}
				}
			},this);
		}
		this.addObserver('_content',this,this._contentDidChange);
	},

	_contentPropertyDidChange : function (content, contentKey) {
		var key = contentKey.slice(9); // remove "content."
		if (key in this || !this._content) { return; } // if shadowed in proxy
		
		var value = this._content.get(key);
		if(value!==null && typeof value==='object') {
			var proxy=this;
			if(value instanceof Ember.RSVP.Promise ) {
				value.then(function(value) {
					if(value!==null && typeof value==='object') {
						value=proxy._getProxy(key,value);	
					}
					proxy.notifyPropertyChange(key);
					proxy._cache[key]=value;
					return value;
				});
				return;
			} else if(!this._proxies[key] || this._proxies[key]!==value) {
				value=this._getProxy(key,value);
				if(Ember.PromiseProxyMixin.detect(value)) {
					value.then(function() {
						proxy.notifyPropertyChange(key);
						proxy._cache[key]=value;
					})
					return;
				}
			}
		}
		this._cache[key]=value;
		this.propertyDidChange(key);
	},
	
	willWatchProperty: function (key) {
		var keys=key.split('.');			
		if(keys.length===1) {
			if(this._syncFromSource) {
				var contentKey = '_content.' + key;
				this.addObserver(contentKey, null, this._contentPropertyDidChange);
			} 
		}
	},
	
	didUnwatchProperty: function (key) {
		var keys=key.split('.');
		if(keys.length===1) { 
			var contentKey = '_content.' + key;
			this.removeObserver(contentKey, null, this._contentPropertyDidChange);
		}
	},

	setUnknownProperty : function(key,value) {
		var keys=key.split('.');
		// If we haven't initialized yet, just set the value
		if(this._proxies===null) {
			this[key]=value;
			return value;
		}
		if(!this._content && this._syncToSource) {
			Ember.assert('Can\'t set proxy property when syncing to source with no content set',true);
		}
		if(keys.length===1) {
			if(value!==null && typeof value==='object') {				
				if(value instanceof Ember.RSVP.Promise || Ember.PromiseProxyMixin.detect(value) ) {
					var proxy=this;
					value.then(function(value) {
						return proxy._getProxy(key,value);
					});
				} else {
					value=this._getProxy(key,value);
				}
			}			
			this._cache[key] = value;
			
			if(this._syncToSource) {
				this._applyKey(this._content,key,value);
			}
			this.propertyDidChange(key);
			return value; 
		}
		key=keys.shift();
		return this._getProxy(key).set(keys.join('.'),value);
	},
	
	unknownProperty : function(key) {
		var keys=key.split('.');
		if(keys.length===1) {
			if ( !(key in this._cache)) {
				if(!this._content) {
					return undefined;
				}
				var value=this._content.get(key);
				if(value!==null && typeof value==='object') {
					
					var proxy=this;
					if(value instanceof Ember.RSVP.Promise ) {
						value=value.then(function(value) {
							if(value!==null && typeof value==='object') {
								value=proxy._getProxy(key,value);								
							}
							proxy.notifyPropertyChange(key);
							return value;
						});
					}  else {
						value=this._getProxy(key,value);
					}					
				}
				this._cache[key] = value;
			}
			return this._cache[key];
		}
		key=keys.shift();
		return this._getProxy(key).get(keys.join('.'));
	},
	
	_applyKey: function(content,key) {
		var proxy=this;
		var value=arguments[2] || this._cache[key];
		if(content[key] instanceof Ember.ComputedProperty && content[key]._readOnly) {
			return;
		}
		if(content instanceof DS.Model) {
			switch(key) {
				case 'id':
				// Fix for Ember-data bug, hasDirtyAttributes is computed but not readOnly
				// falls through
				case 'hasDirtyAttributes':
					return;
			}
		}
		if(Ember.PromiseProxyMixin.detect(value)) {
			value=value.content;
		}

		if(value instanceof Ember.RSVP.Promise) {
			value.then(function(value) {
				proxy._applyKey(content,key,value);
				return value;
			});
		}else if(!ProxyArrayMixin.detect(value)) {
			if(ProxyMixin.detect(value)) {
				value=value._pendingContent || value._content;
			}	
			var currentValue=content.get(key);
			if(currentValue instanceof Ember.RSVP.Promise || Ember.PromiseProxyMixin.detect(currentValue) ) {
				currentValue=currentValue.content;
			}
			if(value!==content.get(key)) {
				content.set(key,value);
				return true;
			}		
		}
		return false;
	},

	
	modelProxyFor: function(object,defaults) {
		if(typeof object==='object') {
			return this._lookupProxy(object);
		} else {
			var proxy = lookupProxy.call(this,object,defaults,{
				fromSource:this._syncFromSource,
				toSource:this._syncToSource
			});
			this._refs.pushObject({
				proxy: proxy,
				reg:Ember.A()
			});
			return proxy;
		}
		
	},
	
	_getProxy : function(key,value) {
		if(!this._proxies[key] || value) {
			var newProxy=this._lookupProxy(value || this._content.get(key));
			if(this._proxies[key]!==newProxy) {
				if(this._proxies[key]) {
					this._unregisterProxy(this._proxies[key]);
				}					
				this._proxies[key]=newProxy;
			}
		}
		return this._proxies[key];
	},
	
	_unregisterProxy: function(proxy) {
		var ref=this._refs.findBy('proxy',proxy);
		if(ref) {
			if(ref.reg.includes(this)) {
				ref.reg.removeObject(this);
			}
		}
	},
	
	_registerProxy: function(proxy) {
		var ref=this._refs.findBy('proxy',proxy);
		if(ref) {
			if(!ref.reg.includes(this)) {
				ref.reg.pushObject(this);
			}
		}
	},
	
	_lookupProxy : function(content) {
		if(ProxyMixin.detect(content)) {
			// TODO: Possible bug, we should probably check whether this proxy is our own reference list
			// We may need to proxy a proxy if we want to have them stackable
			return content;
		}
		var ref=this._refs.findBy('obj',content);
		var _self=this;
		var proxy;
		if(ref) {
			proxy = ref.proxy;
		} else {			
			if(content instanceof Ember.RSVP.Promise) {
				Ember.assert('Proxy did not expect to receive a promise here');
				return null;
			}
			if(Ember.Enumerable.detect(content)) {					
				if(Ember.PromiseProxyMixin.detect(content)) {
					return PromiseArrayProxy.create({
						promise:content.then(function(content){
							return _self._lookupProxy(content);
						})
					});
				} else {
					proxy = proxyArray(Ember.getOwner(this),{
						_syncFromSource:this._syncFromSource,
						_syncToSource:this._syncToSource,
						_content:content,
						_top: this._top || this
					});
				}
			} else {
				if(Ember.PromiseProxyMixin.detect(content)) {
					return PromiseObjectProxy.create({
						promise:content.then(function(content){
							return _self._lookupProxy(content);
						})
					});
				} else {
					proxy = lookupProxy.call(this,content,null,{
						fromSource:this._syncFromSource,
						toSource:this._syncToSource
					});
				}
			}
			
			this._refs.pushObject({
				obj:content,
				proxy: proxy,
				reg:Ember.A()
			});
		}
		this._registerProxy(proxy);
		return proxy;
	},
	
	_eventTarget: null,
	
	_registerEvents: function() {
		var content=this._content;
		if(this._eventTarget) {
			this._eventTarget.off('didDelete',this,this._contentDeleted);
			this._eventTarget=null;
		}
		if(content instanceof DS.Model) {			
			content.on('didDelete',this,this._contentDeleted);
			this._eventTarget=content;
		}
	},
	
	_contentDeleted : function() {
		this.set('_content',null);
	},
	
	_contentDidChange: function() {
		Ember.assert("Can't set Proxy's content to itself", this.get('_content') !== this);
		this._registerEvents();
//	    this._reset();
	},
	
	_apply : function(refs) {
		refs=refs || Ember.A();
		return applyProxy(this,refs);
	},
	
	_updateRef : function(proxy,content) {
		//if(this._top && this._top!==this) {
		//	return this._top._updateRef(proxy);
		//}
		var ref=this._refs.findBy('proxy',proxy);
		if(ref) {
			ref.obj=content || proxy._content;
		}
		//console.log(proxy+' '+content);
	},
	
	_reset : function() {
		this._updateRef(this);
		this.beginPropertyChanges();
		for(var key in this._cache) {
			delete this._cache[key];
			delete this._proxies[key];
			this.notifyPropertyChange(key);
		}				
		this.endPropertyChanges();
	},
	
	destroy: function() {
		this._super();
		if(this._refs && !this._top) {
			this._refs.forEach(function(obj) {
				if(!obj.proxy.isDestroying) {
					obj.proxy.destroy();
				}
			});
		}
		this._unregisterProxy(this);
	},
	
	toString : function() {
		var name =this._super();		
		var contentName='null';
		if(this._content) {
			contentName=this._content.toString();
			if(this._content instanceof Ember.Object) {
				contentName=contentName.slice(1,-1);
			}
		}
		return name.slice(0,-1)+'('+contentName+')>';
	}
	
});

var ProxyArrayMixin = Ember.Mixin.create({
	_map : function(item){
		return this._lookupProxy(item);
	},
	
	toString : function() {
		var name = Ember.PromiseProxyMixin.detect(this) ? '<PromiseProxyArray>' :'<ProxyArray>';
		var contentName='null';
		if(this._content) {
			contentName=this._content.toString();
			if(this._content instanceof Ember.Object) {
				contentName=contentName.slice(1,-1);
			} else if(!contentName && Ember.NativeArray.detect(this._content)) {
				contentName='NativeArray';
			} else if(!contentName && Ember.Enumerable.detect(this._content)) {
				contentName='Enumerable';
			}
		}
		return name.slice(0,-1)+'('+contentName+')>';
	},
	
	_initialContent: function(content) {
		this._isApplying=true;
		this.set('_content',content);
		this._isApplying=false;
	},
	
	_observedContent: null,
	
	_contentDidChange: function() {		
		if(this._content && !this._isApplying) {
			this.setObjects(this._content.toArray());
			if(this._content!==this._observedContent) {
				if(this._observedContent) {
					this._observedContent.removeArrayObserver(this);
				}
				this._observedContent=this._content.addArrayObserver(this,{willChange:function() {},didChange:this._contentArrayDidChange});				
			}
		} else {
			if(this._observedContent) {
				this._observedContent.removeArrayObserver(this);
				this._observedContent=null;
			}
		}
	},
	
	setObjects: function(objects) {
		this._super(objects.map(this._map,this));
	},
	
	unshiftObjects: function(objects) {
		this._super(objects.map(this._map,this));
	},
	
	unshiftObject: function(object) {
		this._super(this._lookupProxy(object));
	},
	
	pushObject: function(object) {
		this._super(this._lookupProxy(object));
	},
	
	length: 0,
	
	_isApplying: false,
	
	_apply: function (refs) {		
		Ember.assert(this+' can not apply without its _content property set',this._content!==null);
		this._isApplying=true;
		var values=Ember.A();
		this.forEach(function(item){
			if(ProxyMixin.detect(item)) {
				item._apply(refs);
				item=item._content;
				if(this instanceof DS.ManyArray && item instanceof DS.Model && item.get('isDeleted') && item.get('currentState.stateName')==='root.deleted.saved') {
					return;
				}
			}
			values.pushObject(item);
		},this._content);		
		values.forEach(function(item,index) {
			if(this.objectAt(index)!==item) {
				this.replace(index,1,[item]);
			}
		},this._content);
		if(values.length<this._content.length) {
			this._content.removeAt(values.length,this._content.length-values.length);
		}
		let ret = this._super.apply(this,arguments);
		this._isApplying=false;
		return ret;
	},
	
	unknownProperty : function(key) {
		if(typeof key!=='string') {
			return this.objectAt(key);
		}
		return this._super.apply(this,arguments);
	},
	
	_contentPropertyDidChange : function (content, contentKey) {
		var key = contentKey.slice(9); // remove "content."
		if(key==='[]') {
			this._contentDidChange();			
		} else {
			return this._super.apply(this,arguments);
		}
	},
	
	init: function(options) {
		this._top=options._top;
		this._syncFromSource=options._syncFromSource;
		this._syncToSource=options._syncToSource;
		this._cache={};
		if(options._content) {
			this._content=options._content;
		}
		if(!this._top) {
			this._refs=Ember.A();
			if(this._content) {
				this._refs.pushObject({
					obj: this._content,
					proxy: this,
					reg: Ember.A()
				});
			}
		} else if(this._top) {
			this._refs=this._top._refs;
		}	
		this._contentDidChange();		
		this.addObserver('_content',this,this._contentDidChange);
		this._super(...arguments);
	},
	
	_contentArrayDidChange() {
		if(!this._isApplying) {
			this._contentDidChange();
		}
	}
});


var proxyArray = function(owner,options) {
	var a=[];
	Ember.NativeArray.apply(a);	
	ProxyMixin.apply(a);	
	ProxyArrayMixin.apply(a);
	var inject=owner.ownerInjection();
	var name=Object.getOwnPropertyNames(inject)[0];
	a[name]=inject[name];
	a.init(options);
	return a;
};

	

export {ProxyMixin,ProxyArrayMixin,proxyArray};
export default Ember.Object.extend(ProxyMixin,{
	
}).reopenClass({
	canInstantiate: function(canDo) {
		this.reopen({
			_canInstantiate:canDo
		});
		return this;
	},
	A: proxyArray,
	
	apply(proxy) {
		Ember.assert("Can only apply instance of form-model-proxy",ProxyMixin.detect(proxy));
		proxy._apply();
		return proxy;
	},
	
	getContent(proxy) {
		Ember.assert("Can only get content for instance of form-model-proxy",ProxyMixin.detect(proxy));		
		return Ember.get(proxy,'_content');
	},
	
	detect(proxy) {
		return ProxyMixin.detect(proxy);
	},
	
	proxyFor(proxyOrOwner,content) {
		if(proxyOrOwner instanceof this) {
			return proxyOrOwner.modelProxyFor(content);
		} else {
			if(Ember.Enumerable.detect(content)) {
				return proxyArray(Ember.getOwner(proxyOrOwner),{
					_content:content
				});
			} else {
				return lookupProxy.call(proxyOrOwner,content,null,{
				});
			}
		}
	},
	
	reset(proxy) {
		Ember.assert("Can only reset instance of form-model-proxy",ProxyMixin.detect(proxy));
		proxy._reset();
		return proxy;
	},
});
