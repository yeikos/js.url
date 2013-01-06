JavaScript/NodeJS URL v1.0.0
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

Example
--------------------------------------

	<html>

		<head>

			<script type="text/javascript" src="https://raw.github.com/yeikos/js.url/master/url.js"></script>

			<script type="text/javascript">

				var url = URL('http://guest:secret@remote:21/filename?a=1#ok');

				console.log(

					url.attr() 

					// { protocol: 'http:', auth: 'guest:secret', host: 'remote:21', hostname: 'remote', ... }

				);

				console.log(

					url.attr('hostname') 

					// remote

				);

				console.log(

					url.query('b', 2).query() 

					// { a : 1, b : 2 }

				);

				console.log(

					url.attr('protocol', 'https').href() 

					// https://guest:secret@remote:21/filename?a=1#ok

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

**URL()**

> Create a new instance.

returns instance.

**URL(url)**

_url: string or attributes object._

> Create a new instance with an URL defined.

returns instance.

**URL(url, location)**

_url: string or attributes object._

_location: string or attributes object._

> Create a new instance with an URL defined in base to the location introduced.

returns instance.

***

### Local methods (URL.prototype)

***

**url.location**

> It's a URL instance added automatically by the constructor, and his attributes are used internally to calculate the result in base to the location defined.

***

**url.href()**

> Build an URL string in base to current attributes values.

returns URL string.

**url.href(url)**

_url: string or attributes object._

> Set a new URL that replaces all attributes.

returns instance.

***

**url.attr()**

> Get all attributes.

returns attributes object.

**url.attr(name)**

_name: attribute name (string)._

> Get value of the attribute.

returns string.

**url.attr(object)**

_object: attributes object._

> Set multiple values to the attributes.

returns instance.

**url.attr(name, value)**

_name: attribute name (string)._

_value: attribute value._

> Set a new value to the attribute.

returns instance.

***

**url.query()**

> Get search attribute in object format.

returns object.

**url.query(name)**

_name: attribute name (string)._

> Get the value of component.

returns string.

**url.query(object)**

_object: compontents object._

> Replace all compontents by the object introduced.

returns instance.

**url.query(name, value)**

_name: compontent name (string)._

_value: compontent value. If it's `null` the compontent will be delete._

> Set a new value to the compontent.

returns instance.

***

**url.hashQuery()**

> Get hash attribute in object format.

returns object.

**url.hashQuery(name)**

_name: attribute name (string)._

> Get the value of component.

returns string.

**url.hashQuery(object)**

_object: compontents object._

> Replace all compontents by the object introduced.

returns instance.

**url.hashQuery(name, value)**

_name: compontent name (string)._

_value: compontent value. If it's `null` the compontent will be delete._

> Set a new value to the compontent.

returns instance.

***

### Global methods (URL)

***

**URL.getElementURL(element)**

_element: element object (DOM Element)._

> Get element URL (form, a, base, link, img, script, iframe).

returns URL if found or empty string if not found (string).

***

**URL.build(url)**

_url: string or attributes object._

> Build a new URL based in attributes introduced.

returns URL (string).

**URL.build(url, location)**

_url: string or attributes object._

_location: string or attributes object._

> Build a new URL based in attributes introduced and doing use location attributes.

returns URL (string).

***

**URL.unbuild(url)**

_url: string or attributes object._

> Unbuilds URL to converting it into a attributes object.

returns attributes object.

**URL.unbuild(url, location)**

_url: string or attributes object._

_location: string or attributes object._

> Unbuilds URL to converting it into a attributes object and doing use location attributes.

returns attributes object.

***

**URL.param(query)**

_query: query object._

> Convert a object into query string.

returns query string.

***

**URL.unparam(query)**

_query: query string._

> Convert a query string into object.

returns query object.

***