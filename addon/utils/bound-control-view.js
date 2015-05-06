import readComponentFactory from 'furnace-forms/utils/read-control-factory';
var _Metamorph = Ember.__loader.require('ember-views/views/metamorph_view')['_Metamorph'];

var read = Ember.__loader.require('ember-metal/streams/utils')['read'];
var chain = Ember.__loader.require('ember-metal/streams/utils')['chain'];
var subscribe = Ember.__loader.require('ember-metal/streams/utils')['subscribe'];
var unsubscribe = Ember.__loader.require('ember-metal/streams/utils')['unsubscribe'];

var mergeViewBindings = Ember.__loader.require('ember-htmlbars/system/merge-view-bindings')['default'];
var EmberError =Ember.__loader.require('ember-metal/error')['default'];
var ContainerView =Ember.__loader.require('ember-views/views/container_view')['default'];

export default ContainerView.extend(_Metamorph, {
  init:function() {
    this._super.apply(this,arguments);
    var componentNameStream = this._boundComponentOptions.componentNameStream;
    var container = this.container;
    var view=this;
    this.componentClassStream = chain(componentNameStream, function() {
      return readComponentFactory(componentNameStream, view);
    });
    subscribe(this.componentClassStream, this._updateBoundChildComponent, this);
    this._updateBoundChildComponent();
  },
  willDestroy:function() {
    unsubscribe(this.componentClassStream, this._updateBoundChildComponent, this);
    this._super.apply(this,arguments);
  },
  _updateBoundChildComponent:function() {
	  var component=this._createNewComponent();
	  if(component)
		  this.replace(0, 1, [component]);
	  else 
		  this.removeChild(this.objectAt(0));
  },
  _createNewComponent:function() {
	var componentNameStream = this._boundComponentOptions.componentNameStream;
	var control=read(componentNameStream);
    var componentClass = read(this.componentClassStream);
    if (!componentClass) {
      //throw new EmberError('HTMLBars error: Could not find component named "' + read(this._boundComponentOptions.componentNameStream) + '".');
    	return;
    }
    var hash    = this._boundComponentOptions;           
    var hashForComponent = {};
    hash['control']=control;
    var prop;
    for (prop in hash) {
      if (prop === '_boundComponentOptions' || prop === 'componentClassStream') { continue; }
      hashForComponent[prop] = hash[prop];
    }
    var props   = {};        
    mergeViewBindings(this, props, hashForComponent);
    return this.createChildView(componentClass, props);
  }
});