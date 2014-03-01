if (typeof document !== 'object' || !document) {

    var document = {

        createElement: function(nodeName) {

            var attributes = {};

            return {

                attributes: attributes,

                nodeName: nodeName,

                nodeType: 1,

                setAttribute: function(name, value) {

                    attributes[name] = value;

                },

                getAttribute: function(name) {

                    return attributes[name];

                }

            };

        }

    };

}

var result = [

    [ {a: 1}, 'a=1'  ],
	
	[ {a: '01'}, 'a=01' ],
	[ {a: '09.6.2'}, 'a=09.6.2' ],
	[ {a: '15e8'}, 'a=15e8' ],
	
	[ {a: [1,2,3,4,5,6,7,8,9,10,11,12]}, 'a[]=1&a[]=2&a[]=3&a[]=4&a[]=5&a[]=6&a[]=7&a[]=8&a[]=9&a[]=10&a[]=11&a[]=12'],
	
	[ {a: [1, [2, [3, 4]]] }, 'a[]=1&a[1][]=2&a[1][1][]=3&a[1][1][]=4'],
	[ {a: { b: ['c', 'd', 'e', ''] }}, 'a[b][]=c&a[b][]=d&a[b][]=e&a[b][]' ],
	
    [ {a: 1, b: 2}, 'a=1&b=2' ],
    [ {a: { b: 2 }}, 'a[b]=2' ],

    [ {a: { b: ['c', 'd', 'e', ''] }}, 'a[b][]=c&a[b][]=d&a[b][]=e&a[b][]' ],
    [ {a: { b: { 1: 'c', 2: 'd', 3: 'e'} }}, 'a[b][1]=c&a[b][2]=d&a[b][3]=e' ],

    [ { 'spaces are replaced by +': '1 + 1 = 2' }, 'spaces+are+replaced+by+%2B=1+%2B+1+%3D+2' ]

];

test('URL.param', function() {

    var index = 0, size = result.length;

    strictEqual( URL.param(), '' );

    strictEqual( URL.param({ a: null, b: undefined, c: function() {}, d: [], e: {}, f: 2}), 'a&b&c&d&e&f=2' );

    strictEqual( URL.param({ a: { b: { 0: 'c', 1: 'd', 2: 'e'} } }), 'a[b][]=c&a[b][]=d&a[b][]=e' );

    strictEqual( URL.param({ 'a[]': 1 }), 'a%5B%5D=1' );

    for (index;index<size;++index)

        strictEqual(

            URL.param(result[index][0]),

            result[index][1]

        );

});

test('URL.unparam', function() {

    var index = 0, size = result.length;

    deepEqual( URL.unparam(), {} );

    deepEqual( URL.unparam('%xx=1'), {} );

    deepEqual( URL.unparam('%41=1'), { A: 1} );

    deepEqual( URL.unparam('%41%5Bb%5D=1'), { A: { b: 1 } } );

    for (index;index<size;++index)

        deepEqual(

            URL.unparam(result[index][1]),

            result[index][0]

        );

});

test('URL.getElementURL', function() {

    var url = 'address',
        element;

    (element = document.createElement('form')).setAttribute('action', url);

    strictEqual(URL.getElementURL(element), url);

    (element = document.createElement('a')).setAttribute('href', url);

    strictEqual(URL.getElementURL(element), url);

    (element = document.createElement('link')).setAttribute('href', url);

    strictEqual(URL.getElementURL(element), url);

    (element = document.createElement('base')).setAttribute('href', url);

    strictEqual(URL.getElementURL(element), url);

    (element = document.createElement('img')).setAttribute('src', '');

    strictEqual(URL.getElementURL(element), '');

    (element = document.createElement('script')).setAttribute('src', url);

    strictEqual(URL.getElementURL(element), url);

    (element = document.createElement('iframe')).setAttribute('src', url);

    strictEqual(URL.getElementURL(element), url);

    (element = document.createElement('span')).setAttribute('src', url);

    strictEqual(URL.getElementURL(element), '');

});

test('URL.normalize.protocol', function() {

    var normalize = URL.normalize;

    strictEqual( normalize.protocol(), '' );

    strictEqual( normalize.protocol('http:'), 'http:' );

    strictEqual( normalize.protocol('PROTOcol+-1.'), 'protocol+-1.:' );

    strictEqual( normalize.protocol('1protocol'), '' );

    strictEqual( normalize.protocol('in%45valid'), '' );

});

test('URL.normalize.auth', function() {

    var normalize = URL.normalize;

    strictEqual( normalize.auth(), '' );

    strictEqual( normalize.auth('user:password'), 'user:password' );

    strictEqual( normalize.auth('user'), 'user' );

    strictEqual( normalize.auth('test1-._~!$&\'()*+,;=:%32%45'), 'test1-._~!$&\'()*+,;=:%32%45');

    strictEqual( normalize.auth('in>valid'), '' );

});

test('URL.normalize.host', function() {

    var normalize = URL.normalize;

    deepEqual( normalize.host(), {

        hostname: '',
        port: ''

    });

    deepEqual( normalize.host('127.0.0.1'), {

        hostname: '127.0.0.1',
        port: ''

    });

    deepEqual( normalize.host('LocalHost'), {

        hostname: 'localhost',
        port: ''

    });

    deepEqual( normalize.host('localhost:8080'), {

        hostname: 'localhost',
        port: '8080'

    });

    deepEqual( normalize.host('[FE80::0202:B3FF:FE1E:8329]:80'), {

        hostname: '[fe80::0202:b3ff:fe1e:8329]',
        port: '80'

    });

    deepEqual( normalize.host('invalid<:21'), {

        hostname: '',
        port: ''

    });

    deepEqual( normalize.host(':21'), {

        hostname: '',
        port: ''

    });

});

test('URL.normalize.hostname', function() {

    var normalize = URL.normalize;

    strictEqual( normalize.hostname(), '');

    strictEqual( normalize.hostname('127.0.0.1'), '127.0.0.1');

    strictEqual( normalize.hostname('LocalHost'), 'localhost');

    strictEqual( normalize.hostname('[FE80::0202:B3FF:FE1E:8329]'), '[fe80::0202:b3ff:fe1e:8329]');

    strictEqual( normalize.hostname('invalid<'), '');

});

test('URL.normalize.port', function() {

    var normalize = URL.normalize;

    strictEqual( normalize.port(), '');

    strictEqual( normalize.port(80), '80');

    strictEqual( normalize.port('21'), '21');

    strictEqual( normalize.port('1024a'), '');

    strictEqual( normalize.port('<'), '');

});

test('URL.normalize.pathname', function() {

    var normalize = URL.normalize;

    strictEqual( normalize.pathname(), '');

    strictEqual( normalize.pathname('a'), 'a');

    strictEqual( normalize.pathname('a//b//c/../'), 'a//b//');

    strictEqual( normalize.pathname('/../../a//b//c/../'), '/a//b//');

    strictEqual( normalize.pathname('/./././a'), '/a');

    strictEqual( normalize.pathname('/a/%41%32/<'), '/a/A2/%3C');

    strictEqual( normalize.pathname('/a%'), '');

});

test('URL.normalize.search', function() {

    var normalize = URL.normalize;

    strictEqual( normalize.search(), '');

    strictEqual( normalize.search('a'), '?a');

    strictEqual( normalize.search({ a: 1 }), '?a=1');

    strictEqual( normalize.search({ a: 1, b: { c: 1 } }), '?a=1&b[c]=1');

    strictEqual( normalize.search('a%'), '');

});

test('URL.normalize.hash', function() {

    var normalize = URL.normalize;

    strictEqual( normalize.hash(), '');

    strictEqual( normalize.hash('a'), '#a');

    strictEqual( normalize.hash({ a: 1 }), '#a=1');

    strictEqual( normalize.hash({ a: 1, b: { c: 1 } }), '#a=1&b[c]=1');

    strictEqual( normalize.hash('a%'), '');

});

test('URL.unbuild', function() {

    var attr = {

        protocol: 'protocol:',
        auth: 'auth',
        host: 'hostname:80',
        hostname: 'hostname',
        port: '80',
        pathname: '/pathname',
        search: '?search',
        hash: '#hash'

    }, element = document.createElement('a');

    element.setAttribute('href', 'protocol://auth@hostname:80/pathname?search#hash');

    deepEqual(

        URL.unbuild(element), attr

    );

    deepEqual(

        URL.unbuild('protocol://auth@hostname:80/pathname?search#hash'), attr

    );

    deepEqual(

        URL.unbuild(attr), attr

    );

    deepEqual(

        URL.unbuild('folder'), {

            protocol: '',
            auth: '',
            host: '',
            hostname: '',
            port: '',
            pathname: 'folder',
            search: '',
            hash: ''

        }

    );

    deepEqual(

        URL.unbuild('/folder'), {

            protocol: '',
            auth: '',
            host: '',
            hostname: '',
            port: '',
            pathname: '/folder',
            search: '',
            hash: ''

        }

    );

    deepEqual(

        URL.unbuild('third', '/first/second'), {

            protocol: '',
            auth: '',
            host: '',
            hostname: '',
            port: '',
            pathname: '/first/third',
            search: '',
            hash: ''

        }

    );


    deepEqual(

        URL.unbuild('third', '/first/second/'), {

            protocol: '',
            auth: '',
            host: '',
            hostname: '',
            port: '',
            pathname: '/first/second/third',
            search: '',
            hash: ''

        }

    );

    deepEqual(

        URL.unbuild('..third', '/first/second/'), {

            protocol: '',
            auth: '',
            host: '',
            hostname: '',
            port: '',
            pathname: '/first/second/..third',
            search: '',
            hash: ''

        }

    );

    deepEqual(

        URL.unbuild('../e/f/g/h/../../h', '/a/b/c/../../c/d').pathname, '/a/c/e/f/h'

    );

    deepEqual(

        URL.unbuild('/../e/f/g/h/../../h/', '/a/b/c/../../c/d').pathname, '/e/f/h/'

    );

    deepEqual(

        URL.unbuild('second#top', URL('https://localhost/first/')), {

            protocol: 'https:',
            auth: '',
            host: 'localhost',
            hostname: 'localhost',
            port: '',
            pathname: '/first/second',
            search: '',
            hash: '#top'

        }

    );

    deepEqual(

        URL.unbuild('second?a=1', 'https://localhost/first'), {

            protocol: 'https:',
            auth: '',
            host: 'localhost',
            hostname: 'localhost',
            port: '',
            pathname: '/second',
            search: '?a=1',
            hash: ''

        }

    );


    deepEqual(

        URL.unbuild('//address', 'ftp://localhost/first?a=1#top'), {

            protocol: 'ftp:',
            auth: '',
            host: 'address',
            hostname: 'address',
            port: '',
            pathname: '',
            search: '',
            hash: ''

        }

    );

});

test('URL.build', function() {

    strictEqual(

        URL.build({

            protocol: 'protocol:',
            auth: 'auth',
            host: 'hostname:80',
            hostname: 'hostname',
            port: '80',
            pathname: '/pathname',
            search: '?search',
            hash: '#hash'

        }),

        'protocol://auth@hostname:80/pathname?search#hash'

    );

    strictEqual(

        URL.build('second#top', 'https://localhost/first/'),

        'https://localhost/first/second#top'

    );

    strictEqual(

        URL.build('second?a=1', 'https://localhost/first'),

        'https://localhost/second?a=1'

    );

    strictEqual(

        URL.build('//address', 'ftp://localhost/first?a=1#top'),

        'ftp://address'

    );

    strictEqual(

        URL.build('last', '/first/'),

        '/first/last'

    );

});

test('URL.instance', function() {

    strictEqual( URL.instance() instanceof URL, true );

    strictEqual( URL.instance([], function() {

        this.test = true;

    }).test, true );

});

test('URL.prototype.constructor', function() {

    strictEqual( new URL() instanceof URL, true );

    strictEqual( URL() instanceof URL, true );

});

test('URL.prototype.attr', function() {

    var input = 'https://user:password@localhost:80/folder/filename?a=1&b=2#top',

        url = URL(input);

    deepEqual( url.attr(), {

        auth: 'user:password',
        hash: '#top',
        host: 'localhost:80',
        hostname: 'localhost',
        pathname: '/folder/filename',
        port: '80',
        protocol: 'https:',
        search: '?a=1&b=2'

    });

    url.attr().hostname = 'changed';

    strictEqual( url.attr('hostname'), 'localhost' );

    strictEqual( url.attr({ hostname: '127.0.0.1' }).attr('Hostname'), '127.0.0.1' );

    strictEqual( url.attr({ auth: null }).attr('auth'), '' );

    strictEqual( url.attr('protocol', 'http').attr('protocol'), 'http:' );

    strictEqual( url.attr('invalid-attr', 'value').attr('invalid-attr'), '' );

    strictEqual( url.attr('protocol', 'invalid-value!').attr('protocol'), '' );

    strictEqual( URL().attr('protocol', 'http').attr('protocol'), 'http:' );

    strictEqual( URL().attr('port', 8080).attr('port'), '8080' );

    strictEqual( URL().attr('search', 'a=2').attr('search'), '?a=2' );
    strictEqual( URL().attr('search', 'a=2').attr('query'), '?a=2' );

    strictEqual( URL(input).attr({ auth: null }).attr('auth'), '' );

    deepEqual( URL(input).attr(), {

        auth: 'user:password',
        hash: '#top',
        host: 'localhost:80',
        hostname: 'localhost',
        pathname: '/folder/filename',
        port: '80',
        protocol: 'https:',
        search: '?a=1&b=2'

    });

});


test('URL.prototype.location', function() {

    var url = URL();

    strictEqual(

        url.location instanceof URL, true

    );

    url.location.href('/first/');

    strictEqual(

        url.href('second').href(), '/first/second'

    );

    url.location.href('https://localhost');

    strictEqual(

        url.href('//127.0.0.1').href(), 'https://127.0.0.1'

    );

    url.location.href('?a=1#top');

    strictEqual(

        url.href('#x').href(), '?a=1#x'

    );

    delete url.location;

    strictEqual(

        url.href('folder').href(), 'folder'

    );

});

test('URL.prototype.href', function() {

    var input = 'https://user:password@localhost:80/folder/filename?a=1&b=2#top',
        url;

    strictEqual( URL().href(), '' );

    strictEqual( URL(input).href(), input );

    strictEqual( URL('a/b/c/../../d').href(), 'a/d' );

    strictEqual( URL('folder////path///test').href(), 'folder////path///test' );

    strictEqual( URL({ hostname: 'localhost' }).href(), '//localhost' );

    strictEqual( URL({ hostname: 'localhost' }).attr('port', 8080).href(), '//localhost:8080' );


});

test('URL.prototype.search/query', function() {

    var url = URL().attr('search', 'a=1');

    ok(URL.prototype.query === URL.prototype.search);

    deepEqual( url.search(), { a : 1 } );

    strictEqual( url.search('a'), 1 );

    strictEqual( url.search('b'), undefined );

    strictEqual( url.search('b', 2).attr('search'), '?a=1&b=2' );
    strictEqual( url.attr('query'), '?a=1&b=2' );

    strictEqual( url.search('a', null).attr('search'), '?b=2' );
    strictEqual( url.attr('query'), '?b=2' );

    strictEqual( url.search({ c: 3 }).attr('search'), '?c=3' );
    strictEqual( url.attr('query'), '?c=3' );

});

test('URL.prototype.hash', function() {

    var url = URL().attr('hash', 'a=1');

    deepEqual( url.hash(), { a : 1 } );

    strictEqual( url.hash('a'), 1);

    strictEqual( url.hash('b'), undefined );

    strictEqual( url.hash('b', 2).attr('hash'), '#a=1&b=2' );

    strictEqual( url.hash('a', null).attr('hash'), '#b=2' );

    strictEqual( url.hash({ c: 3 }).attr('hash'), '#c=3' );

});

test('URL.prototype.isExternal', function() {

    strictEqual( URL('http://localhost', 'http://localhost').isExternal(), false );

    strictEqual( URL('//localhost', 'http://localhost').isExternal(), false );

    strictEqual( URL('/folder', 'http://localhost').isExternal(), false );

    strictEqual( URL('?a=1', 'http://localhost').isExternal(), false );

    strictEqual( URL('#top', 'http://localhost').isExternal(), false );

    strictEqual( URL('http://localhost').isExternal(), true );

    strictEqual( URL('/folder').isExternal(), false );

    strictEqual( URL('?a=1', '/folder').isExternal(), false );

    strictEqual( URL('https://localhost', 'http://localhost').isExternal(), true );

    strictEqual( URL('http://127.0.0.1', 'http://localhost').isExternal(), true );

    strictEqual( URL('//127.0.0.1', 'http://localhost').isExternal(), true );

    strictEqual( URL('http://localhost', '//localhost').isExternal(), true );

    strictEqual( URL('http://localhost', '/folder').isExternal(), true );

    var url = URL('http://localhost/filename');

    delete url.location;

    strictEqual( url.isExternal(), true );

    strictEqual( url.attr('protocol', null).isExternal(), true );

    strictEqual( url.attr('host', null).isExternal(), false );

    strictEqual( url.href('').isExternal(), false );

});

test('URL.prototype.select', function() {

    var input = 'http://guest@localhost:80/filename.html?a=1#top',
        url = URL(input);

    strictEqual( URL('subsection', 'http://localhost/section/').select('pathname'), '/section/subsection' );

    strictEqual( url.select.apply(url, URL.attributes), input );

    strictEqual( url.select('protocol'), 'http://' );

    strictEqual( url.select('auth'), '' );

    strictEqual( url.select('protocol', 'auth'), 'http://' );

    strictEqual( url.select('protocol', 'hostname', 'auth'), 'http://guest@localhost' );

    strictEqual( url.select('host', 'search'), '//localhost:80/?a=1' );

    strictEqual( url.select('protocol', 'pathname', 'hash'), 'http:///filename.html#top' );

    strictEqual( url.select('port', 'pathname'), '/filename.html' );

    strictEqual( url.select('hash'), '#top' );

    strictEqual( url.select(), '' );

    strictEqual( url.select('not-exists'), '' );

});

test('URL.prototype.unselect', function() {

    var input = 'http://guest@localhost:80/filename.html?a=1#top',
        url = URL(input);

    strictEqual( url.unselect.apply(url, URL.attributes), '' );

    strictEqual( url.unselect('protocol'), '//guest@localhost:80/filename.html?a=1#top' );

    strictEqual( url.unselect('auth'), 'http://localhost:80/filename.html?a=1#top' );

    strictEqual( url.unselect('protocol', 'auth'), '//localhost:80/filename.html?a=1#top' );

    strictEqual( url.unselect('protocol', 'hostname', 'auth'), '/filename.html?a=1#top' );

    strictEqual( url.unselect('host', 'search'), 'http:///filename.html#top' );

    strictEqual( url.unselect('protocol', 'pathname', 'hash'), '//guest@localhost:80/?a=1' );

    strictEqual( url.unselect('port', 'pathname'), 'http://guest@localhost/?a=1#top' );

    strictEqual( url.unselect('hash'), 'http://guest@localhost:80/filename.html?a=1' );

    strictEqual( url.unselect(), input );

    strictEqual( url.unselect('not-exists'), input );

});

test('URL.prototype.to', function() {

    var input = 'http://localhost:80/filename.html?a=1#top',
        url = URL(input);

    strictEqual( url.to('protocol'), 'http://' );

    strictEqual( url.to('host'), 'http://localhost:80' );

    strictEqual( url.to('hostname'), 'http://localhost' );

    strictEqual( url.to('port'), 'http://localhost:80' );

    strictEqual( url.to('pathname'), 'http://localhost:80/filename.html' );

    strictEqual( url.to('search'), 'http://localhost:80/filename.html?a=1' );

    strictEqual( url.to('hash'), input );

    strictEqual( url.to('not-exists'), input );

    strictEqual( url.to(), input );

});

test('URL.prototype.from', function() {

    var input = 'http://localhost:80/filename.html?a=1#top',
        url = URL(input);

    strictEqual( url.from('protocol'), input);

    strictEqual( url.from('host'), '//localhost:80/filename.html?a=1#top' );

    strictEqual( url.from('hostname'), '//localhost/filename.html?a=1#top' );

    strictEqual( url.from('port'), '/filename.html?a=1#top' );

    strictEqual( url.from('pathname'), '/filename.html?a=1#top' );

    strictEqual( url.from('search'), '?a=1#top' );

    strictEqual( url.from('hash'), '#top' );

    strictEqual( url.from('not-exists'), input );

    strictEqual( url.from(), input );

});