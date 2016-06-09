export default function checked(options) {
	if(options.hasOwnProperty('checked')) {
		this._meta.options._checkedValue=options.checked;		
	}
	if(options.hasOwnProperty('unchecked')) {
		this._meta.options._uncheckedValue=options.unchecked;		
	}
	return this;
}