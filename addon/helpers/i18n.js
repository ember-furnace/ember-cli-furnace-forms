/**
 * @module furnace
 * @submodule furnace-forms
 */
import Ember from "ember";

/**
 * Implements i18n helper if not available
 * @method i18n
 * @for Furnace.Forms.helpers
 * @param {String} Text
 * @param {Hash} options
 * @return {String} HTML string  
 */
export default Ember.HTMLBars.makeBoundHelper(function i18nDummyHelper(params, hash, options, env) {
	return params[0];
});
