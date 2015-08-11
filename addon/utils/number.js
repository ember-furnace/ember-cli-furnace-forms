import Number from 'furnace-forms/mixins/controls/number';
export default function number() {
	this._meta.options._mixin.number=Number;
	
	return this;
}