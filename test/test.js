'use strict';

var assert = require('assert');
var todoApp = require('../app');

describe('todo-app', function() {

	it('should export an object', function() {
		assert(todoApp);
		assert.equal(typeof todoApp, 'object');
	});

	it('should throw an error when invalid args are passed', function() {
		assert.throws(function() {
			todoApp();
		});
	});

});