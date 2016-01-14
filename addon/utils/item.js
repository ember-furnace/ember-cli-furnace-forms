import Ember from 'ember';

export default function itemControl() {
	if(typeof arguments[0] ==='function' && !(arguments[0] instanceof Ember.ComputedProperty)) {
		this._meta.options._itemControlFn=arguments[0];
	} else {
		arguments[0]._meta.type='form-item-control';
		this._meta.options._itemControl=arguments[0];
	}
	return this;
}