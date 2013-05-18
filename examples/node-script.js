// var URL = require('kurl');

var URL = require('../url.js');

console.log(

	'\nExample 1\n\n',

	URL('http://guest:secret@remote:21/filename?a=1#ok').attr()

);

console.log(

	'\nExample 2\n\n',

	URL('http://youtu.be').attr('protocol', 'https').attr({

		pathname: '/iCkYw3cRwLo',
		search: { t: '22s' },
		hash: { hello : 'world' }

	}).href()

);

console.log(

	'\nExample 3\n\n',

	URL('second.html', {

		hostname: 'localhost',
		pathname: '/first/'

	}).href()

);