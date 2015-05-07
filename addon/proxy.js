import Ember from 'ember';
var Proxy = Ember.Object.extend({
	_syncFromSource : true,
	
	_syncToSource : true,
	
	_proxies : null,
	_cache : null,
	
	_content : null,
	
	
	init: function() {
		this._super();
		this._proxies={};
		this._cache={};
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
		if(!this._content)
			return undefined;
		if(keys.length===1) {
			this._cache[key] = value;
			if(this._syncToSource)
				this._content.set(key,value);
			this.propertyDidChange(key);
			return value; 
		}
		var key=keys.shift();
		return this._getProxy(key).set(keys.join('.'),value);
	},
	
	unknownProperty : function(key) {
		var keys=key.split('.');
		if(!this._content)
			return undefined;
		if(keys.length===1) {
			if (this._syncFromSource || !(key in this._cache)) {
				this._cache[key] = this._content.get(key);
			}
			return this._cache[key];
		}
		var key=keys.shift();
		return this._getProxy(key).get(keys.join('.'));
	},
	
	_getProxy : function(key) {
		if(!this._proxies[key]) {
			this._proxies[key]=Proxy.create({
				_content:this._content.get(key),
				_syncFromSource:this._syncFromSource,
				_syncToSource:this._syncToSource
				
			});
		}
		return this._proxies[key];
	},
	
	_contentDidChange: Ember.observer('_content', function() {
	    Ember.assert("Can't set Proxy's content to itself", get(this, '_content') !== this);
	    this._reset();
	}),
	
	_apply : function() {
		for(var i in this._proxies) {
			this._proxies[i]._apply();
		}
		if(!this._syncToSource) {
			for(var key in this._cache) {
				if(this._content[key] instanceof Ember.ComputedProperty && this._content[key]._readOnly)
					continue;
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
	},
	
});
export default Proxy;