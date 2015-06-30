export default function itemControl() {
	if(typeof arguments[0] ==='function') {
		this._meta.options._itemControlFn=arguments[0];
	} else {
		arguments[0]._meta.type='form-item-control';
		this._meta.options._itemControl=arguments[0];
	}
	return this;
}