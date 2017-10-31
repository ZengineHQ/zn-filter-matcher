'use strict';

var Jasmine = require('jasmine');
var jasmine = new Jasmine(); // jshint ignore:line

jasmine.loadConfigFile('tests/support/jasmine.json');

jasmine.execute();
