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
});

export default Router;
