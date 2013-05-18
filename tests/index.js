var qunit = require('./qunit/node_modules/qunit/index.js');

qunit.run({

	code: { path: '../url.js', namespace: 'URL' },
	tests: 'tests.js'

});