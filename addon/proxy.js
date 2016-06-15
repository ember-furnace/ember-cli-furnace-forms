import Ember from 'ember';
var _Proxy = Ember.Object.extend({
	_syncFromSource : true,
	
	_syncToSource : true,
	
	_refs: null,
	
	_proxies : null,
	
	_cache : null,
	
	_content : null,
	
	_top : null,
	
	init: function() {
		this._super();
		this._proxies={};
		this._cache={};
		this._refs={};
		if(!this._top) {
			this._refs[this._content]=this;
		}
	},

	_contentPropertyDidChange : function (content, contentKey) {
		var key = contentKey.slice(9); // remove "content."
		if (key in this) { return; } // if shadowed in proxy
		this._cache[key] = this._content.get(key);
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
		if(!this._content) {
			return undefined;
		}
		if(keys.length===1) {
			this._cache[key] = value;
			if(this._syncToSource) {
				this._content.set(key,value);
			}
			this.propertyDidChange(key);
			return value; 
		}
		key=keys.shift();
		return this._getProxy(key).set(keys.join('.'),value);
	},
	
	unknownProperty : function(key) {
		var keys=key.split('.');
		if(!this._content) {
			return undefined;
		}
		if(keys.length===1) {
			if (this._syncFromSource || !(key in this._cache)) {
				
				var value=this._content.get(key);
				
				if(value!==null && typeof value==='object') {
					value=this._lookupProxy(value);
					if(Ember.PromiseProxyMixin.detect(value)) {
						value.addObserver("_content",this,function() {
							this.propertyDidChange(key);
						});
					}
				}
				this._cache[key] = value;
			}
			return this._cache[key];
		}
		key=keys.shift();
		return this._getProxy(key).get(keys.join('.'));
	},
	
	_getProxy : function(key) {
		if(!this._proxies[key]) {
			this._proxies[key]=this._lookupProxy(this._content.get(key));
		}
		return this._proxies[key];
	},
	
	_lookupProxy : function(content) {
		if(this._top) {
			return this._top._lookupProxy(content);
		}
		if(this._refs[content]!==undefined) {
			return this._refs[content];
		}
		
		var proxy;
		if(Ember.PromiseProxyMixin.detect(content)) {
			proxy = _Proxy.extend(Ember.PromiseProxyMixin).create({
				_top: this,
				_syncFromSource:this._syncFromSource,
				_syncToSource:this._syncToSource,
				promise : content.then(function(value){
					proxy.set('_content',value);						
					return value;
				}),
				_content : null,						
			});
		} else {
			proxy = _Proxy.create({
				_top: this,
				_content:content,
				_syncFromSource:this._syncFromSource,
				_syncToSource:this._syncToSource
				
			});		
		}
		this._refs[content]=proxy;
		return proxy;
	},
	
	_contentDidChange: Ember.observer('_content', function() {
	    Ember.assert("Can't set Proxy's content to itself", this.get('_content') !== this);
	    this._reset();
	}),
	
	_apply : function() {
		for(var i in this._proxies) {
			this._proxies[i]._apply();
		}
		if(!this._syncToSource) {
			for(var key in this._cache) {
				if(this._content[key] instanceof Ember.ComputedProperty && this._content[key]._readOnly) {
					continue;
				}
				this._content.set(key,this._cache[key]);
			}
		}
	},
	
	_reset : function() {
		for(var i in this._proxies) {
			this._proxies[i].destroy();
		}
		this._proxies={};
		this._cache={};
	},
	
	destroy: function() {
		for(var i in this._proxies) {
			this._proxies[i].destroy();
		}
		this._super();
	},
	
});
export default _Proxy;