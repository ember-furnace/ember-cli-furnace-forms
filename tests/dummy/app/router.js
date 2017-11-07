import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
	this.route('inputs', {path:'/inputs'}, function() {
		this.route('text', {path:'/text'});
		this.route('password', {path:'/password'});
		this.route('radio', {path:'/radio'});
		this.route('checkbox', {path:'/checkbox'});
		this.route('checklist', {path:'/checklist'});
	});
	this.route('conditions', {path:'/conditions'}, function() {
		this.route('stacked', {path:'/stacked'});
	});
	this.route('integration', {path:'/integration'},function() {
		this.route('basics', {path:'/basics'},function() {
			this.route('binding', {path:'/binding'});
		});
		this.route('lists', {path:'/lists'},function() {
			this.route('single', {path:'/single'});
			this.route('embedded', {path:'/embedded'});
		});
		this.route('embedded-promise', {path:'/embedded-promise'});
	});
	
	this.route('company', {path:'/company'});
	
});

export default Router;
