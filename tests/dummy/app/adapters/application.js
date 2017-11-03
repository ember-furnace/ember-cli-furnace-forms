import DS from 'ember-data';
export default DS.RESTAdapter.extend({
	namespace: 'data',
	buildURL() {
		return this._super(...arguments)+'.json';
	}
});