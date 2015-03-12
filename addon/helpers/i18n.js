import Ember from "ember";
export default Ember.HTMLBars.makeBoundHelper(function i18nDummyHelper(params, hash, options, env) {
	return params[0];
});
