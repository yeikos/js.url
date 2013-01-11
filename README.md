JavaScript/NodeJS URL v1.2.1
==================================================

What is this?
--------------------------------------

It's an JavaScript class that parses an URL and convert it into a object with similar properties to object Location (window.location). Also included inverse process (object to URL string), and a lot of features that it will help you to modify a URL easily. 

Compatible with browser JavaScript and NodeJS (https://npmjs.org/package/kurl).

Demo online
--------------------------------------

http://jsfiddle.net/yeikos/a2LdT/

More info
--------------------------------------

http://www.yeikos.com/2013/01/javascript-nodejs-url-parser.html

Changelog
--------------------------------------

**v1.2.1 - 11/01/13**

- Added to prototype: `instance`.
- Constructor improved.
- Bug fix in `_prototypeSelect`: `select`, `unselect`, `from`, `to`.
- Bug fix in URL.normalize.host: it will be converted to lowercase.

**v1.2.0 - 10/01/13**

- Added to prototype: `unselect`.

**v1.1.0 - 09/01/13**

- Added to prototype: `isExternal`, `select`, `from`, `to`.

- Renamed prototype methods: `query` to `search` and `queryHash` to `hash`.

- URL argument now can be a DOM element.

- Code more clean and lightweight.

- Bug fix and optimizations.

Example
--------------------------------------

	<html>

		<head>

			<script type="text/javascript" src="https://raw.github.com/yeikos/js.url/master/url.js"></script>

			<script type="text/javascript">

				var url = URL('http://guest:secret@remote:21/filename?a=1#ok');

				console.log(

					url.attr() 

					/*{ 

						protocol: 'http:',
						auth: 'guest:secret',
						host: 'remote:21',
						hostname: 'remote',
						port: 21,
						pathname: '/filename',
						search: '?a=1',
						hash: '#ok'

					}*/

				);

				console.log(

					url.attr('hostname') 

					// remote

				);

				console.log(

					url.attr('hostname', 'localhost').href()

					// http://guest:secret@localhost:21/filename?a=1#ok

				);

				console.log(

					url.attr('search'),

					// ?a=1

					url.search('b', 2).search(),

					// { a : 1, b : 2 }

					url.attr('search')

					// ?a=1&b=2

				);

				console.log(

					url.hash({ a: 1 }).select('hostname', 'pathname', 'hash')

					// //localhost/filename#a=1

				);

				console.log(

					URL('http://localhost', 'https://localhost').isExternal(),

					// true

					URL('/folder', 'https://localhost').isExternal()

					// false

				);

				console.log(

					URL('subsection?a=1', 'http://localhost/section/').from('pathname')

					// /section/subsection?a=1

				);

			</script>

		</head>

		<body>See console log.</body>

	</html>

Attributes
--------------------------------------

The attributes names match with of Location Object Properties (http://www.w3schools.com/jsref/obj_location.asp), except `href` that it's ignored, and `auth` that it`s added.

Attributes: `protocol`, `auth`, `host`, `hostname`, `port`, `pathname`, `search`, `hash`.

API methods
--------------------------------------

### Constructor (URL)

***

**URL(url, location)**

_url: string, attributes object or DOM element (optional)._

_location: string, attributes object or DOM element (optional)._

> Creates a new instance with an URL in base to the location introduced.

returns instance.

***

### Local methods (URL.prototype)

***

**url.location**

> It's a URL instance added automatically by the constructor, and his attributes are used internally to calculate the result in base to the location defined.

***

**url.href()**

> Builds an URL string in base to current attributes values.

returns URL string.

**url.href(url)**

_url: string, attributes object or DOM element._

> Sets a new URL that replaces all attributes.

returns instance.

***

**url.attr()**

> Gets all attributes.

returns attributes object.

**url.attr(name)**

_name: attribute name (string)._

> Gets value of the attribute.

returns string.

**url.attr(object)**

_object: attributes object._

> Sets multiple values to the attributes.

returns instance.

**url.attr(name, value)**

_name: attribute name (string)._

_value: attribute value._

> Sets a new value to the attribute.

returns instance.

***

**url.search()**

> Gets search attribute in object format.

returns object.

**url.search(name)**

_name: attribute name (string)._

> Gets the value of component.

returns string.

**url.search(object)**

_object: compontents object._

> Replaces all compontents by the object introduced.

returns instance.

**url.search(name, value)**

_name: compontent name (string)._

_value: compontent value. If it's `null` the compontent will be delete._

> Sets a new value to the compontent.

returns instance.

***

**url.hash()**

> Gets hash attribute in object format.

returns object.

**url.hash(name)**

_name: attribute name (string)._

> Gets the value of component.

returns string.

**url.hash(object)**

_object: compontents object._

> Replaces all components by the object introduced.

returns instance.

**url.hash(name, value)**

_name: compontent name (string)._

_value: compontent value. If it's `null` the compontent will be delete._

> Sets a new value to the compontent.

returns instance.

***

**url.isExternal()**

> Checks if the address is external in base to the location.

returns true or false (boolean).

***

**url.select(name, name, ...)**

_name: attributes names (string)._

> Builds an URL string using only selected attributes.

returns URL (string).

***

**url.unselect(name, name, ...)**

_name: attributes names (string)._

> Builds an URL string excluding selected attributes.

returns URL (string).

***

**url.from(name)**

_name: attribute name (string)._

> Builds an URL string starting from the selected attribute.

returns URL (string).

***

**url.to(name)**

_name: attribute name (string)._

> Builds an URL string starting from the beginning to the selected attribute.

returns URL (string).

***

### Global methods (URL)

***

**URL.instance(argv, callback)**

_argv: array argument of the constructor (optional)._
_callback: function whose context is the new instance (optional)._

> Create a new URL instance with arguments, calling first to callback and finally to constructor.

returns instance.

***

**URL.getElementURL(element)**

_element: element object (DOM Element)._

> Gets element URL (form, a, base, link, img, script, iframe).

returns URL if found or empty string if not found (string).

***

**URL.build(url, location)**

_url: string, attributes object or DOM element._

_location: string, attributes object or DOM element (optional)._

> Builds a new URL based in attributes introduced and doing use location attributes.

returns URL (string).

***

**URL.unbuild(url, location)**

_url: string, attributes object or DOM element._

_location: string, attributes object or DOM element (optional)._

> Unbuilds URL to converting it into a attributes object and doing use location attributes.

returns attributes object.

***

**URL.param(query)**

_query: query object._

> Converts a object into query string.

returns query string.

***

**URL.unparam(query)**

_query: query string._

> Converts a query string into object.

returns query object.

***