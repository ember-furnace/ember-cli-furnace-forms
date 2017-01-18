import Ember from 'ember';

export default Ember.Helper.helper(function(params){
	let control=params[0],component;
	if(params.length===2) {
		component=params[1];
	}
	if(control.get('_decoratorName')) {
		return control.get('decorator');
	} else {
		let decoratorName=component.get('optionType');
		let decoratorType=control.get('_decoratorType')
		Ember.assert('furnace-forms: '+component+' ('+component.control._name+') does not specify a decorator name for option',decoratorName);
		return decoratorName+'.'+decoratorType+'-decorator';
	}
});