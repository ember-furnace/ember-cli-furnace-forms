import Ember from 'ember';
import Control from 'furnace-forms/controls/abstract';
var read = Ember.__loader.require('ember-metal/streams/utils')['read'];

export default function readComponentFactory(nameOrStream, view) {
  var control = read(nameOrStream);  
  if(control===null)
	  return null;
  Ember.assert('The dynamic control helper only supports passing a control object!',control instanceof Control);
  return control.getComponentClass(view); 
}