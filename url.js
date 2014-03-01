/*!
 * @name JavaScript/NodeJS URL v1.2.7
 * @author yeikos
 * @repository https://github.com/yeikos/js.url

 * Copyright 2014 yeikos - MIT license
 * https://raw.github.com/yeikos/js.url/master/LICENSE
 */

;(function(isNode) {

	var Public = function URL(url, location) {

		// Si la instancia no ha sido creada

		if (!(this instanceof Public))

			// Devolvemos una instancia

			return Public.instance(arguments);

		// Inicializamos el objeto contenedor de atributos

		this._attributes = {};

		// Si la instancia sobre la que nos encontramos no es `location`

		if (!this.isLocation)

			// Creamos la instancia `location` con un marcador para evitar repetir código

			this.location = Public.instance((arguments.length > 1)  ? [location] : [], function() {

				this.isLocation = true;

			});

		// Establecemos la dirección

		if (arguments.length)

			this.href(url);

		return this;

	}, publicName = 'URL';

	Public.prototype = {

		constructor: Public,

		// Atributos de la URL (interactuar con el método `attr`)

		_attributes: null,

		// Establece/Obtiene el valor de la URL

		href: function(input) {

			var temp;

			// Si no hay parámetros

			if (!arguments.length) {

				// Construimos la URL con los atributos y la devolvemos como cadena de texto

				return Public.build(this._attributes, this.location);

			// Si el parámetro es `null`

			} else if (input === null) {

				// Vaciamos los atributos

				this._attributes = {};

			// Si el parámetro es una cadena de texto o un objecto

			} else if ((temp = typeof input) === 'string' || (input && temp === 'object')) {

				// Desmontamos la URL y guardamos su información en forma de objeto

				this._attributes = Public.unbuild(input, this.location);

			}

			return this;

		},

		// Establece/Obtiene valores de atributos

		attr: function(name, value) {

			var temp = arguments.length;

			// Si no hay parámetros

			if (!temp) {

				// Devolvemos una copia sin referencias de los atributos actuales

				var buffer = {};

				for (temp in this._attributes)

					buffer[temp] = _toString(this._attributes[temp]);

				return buffer;

			// Si hay un parámetro

			} else if (temp === 1) {

				// Si es una cadena de texto

				if ((temp = typeof name) === 'string') { // get()

					name = name.toLowerCase();

					if (name === 'query')

						name = 'search';

					// Devolvemos el valor del atributo en formato literal

					return _toString(this._attributes[name.toLowerCase()]);

				// Si es un objeto

				} else if (name && (temp = typeof name) === 'object') { // set(object)

					// Recorremos sus propiedades y las establecemos una a una

					for (temp in name)

						this.attr(temp, name[(temp || '').toLowerCase()]);

				}

			// Si hay dos parámetros y el nombre del atributo es una cadena de texto

			} else if (temp === 2 && typeof name === 'string' && (temp = name.toLowerCase())) { // set(name, value)

				// Si el atributo existe y el valor es válido

				if (((function(index) {

						while(index--)

							if (Public.attributes[index] === name)

								return true;

					})(Public.attributes.length))) {

						// Si se trata del atributo `host` o `hostname`

						if (name === 'host' || name === 'hostname' || name === 'port') {

							// Si el atributo es `host` actualizamos el `hostname` y el `port` (hostname:port)
							// Si el atributo es `hostname` actualizamos el `host` y dejamos el `port` intacto
							// Si el atributo es `port` actualizaremos `host` y `hostname`

							if (name === 'port') {

								temp = {

									hostname: this._attributes.hostname,
									port: Public.normalize.port(value)

								};

							} else {

								temp = Public.normalize.host(

									_toString(value) + (

										(name === 'hostname' && this._attributes.port) ? (':' + this._attributes.port) : ''

									)

								);

							}

							this._attributes.host = temp.hostname + (temp.port ? (':' + temp.port) : '');
							this._attributes.hostname = temp.hostname;
							this._attributes.port = temp.port;

						} else {

							if (name === 'query')

								name = 'search';

							// Establecemos el nuevo valor normalizado del atributo

							this._attributes[name] = Public.normalize[name](value);

						}

				}

			}

			return this;

		},

		// Opera con el atributo `search` en forma de objeto

		search: function() {

			return _prototypeQuery.apply(this, ['search'].concat([].slice.apply(arguments)));

		},

		// Opera con el atributo `hash` en forma de objeto

		hash: function() {

			return _prototypeQuery.apply(this, ['hash'].concat([].slice.apply(arguments)));

		},

		// Comprueba si la URL es externa

		isExternal: function() {

			// Construimos los atributos en base a la localización

			var attr = Public.unbuild(this._attributes, this.location);

			// Si no se encuentra disponible la instancia localización

			if (!(this.location instanceof Public))

				// La dirección será externa si tiene definido el atributo `protocol` o `host`

				return (attr.protocol || attr.host) ? true : false;

			// La URL será externa si `protocol` o `host` no coincide con el de localización

			return (this.location.attr('protocol') !== attr.protocol || this.location.attr('host') !== attr.host);

		},

		// Construye la URL con los atributos seleccionados

		select: function() {

			return _prototypeSelect.apply(this, [arguments]);

		},

		// Construye la URL sin los atributos seleccionados

		unselect: function() {

			var attr = Public.attributes.slice(0),
				argv = [].slice.apply(arguments),
				buffer = {},
				x = argv.length,
				y = attr.length;

			// Convertimos la matriz de argumentos a objeto

			while (x--)

				buffer[_toString(argv[x]).toLowerCase()] = 1;

			// Si se desea eliminar el atributo `hostname` o `port`

			if (buffer.hostname || buffer.port) {

				// Eliminamos el atributo `host`, ya que contiene a ambos

				buffer.host = 1;

			// Si se desea eliminar el atributo `host`

			} else if (buffer.host) {

				// Eliminamos el atributo `hostname` y `port`, ya que contiene a ambos

				buffer.hostname = 1;
				buffer.port = 1;

			}

			// Recorremos los atributos

			while (y--)

				// Si se encuentra en la lista

				if (buffer[attr[y]])

					// Lo eliminamos

					attr.splice(y, 1);

			return _prototypeSelect.apply(this, [attr]);

		},

		// Construye la URL empezando por el atributo introducido

		from: function(input) {

			return _prototypeSelect.apply(this, [Public.attributes.slice(0).reverse(), input]);

		},

		// Construye la URL empezando desde el principio hasta el atributo introducido

		to: function(input) {

			return _prototypeSelect.apply(this, [Public.attributes, input]);

		}

	};

	Public.prototype.query = Public.prototype.search;

	Public.version = '1.2.7';

	// Atributos válidos de la URL

	Public.attributes = ['protocol', 'auth', 'host', 'hostname', 'port', 'pathname', 'search', 'query', 'hash'];

	// Normalización de la URL

	Public.normalize = {

		// Clasificación de las partes de una URL

		regexp_split: /^(?:(?:(.+:)?\/\/)(?:(?:(.+)@)?([^\/:]+)(?::([^\/]+))?)?)?(?:(\/?[^?#]*)?(\?[^#]*)?(#.*)?)?/,

		// Validación de las diversas partes de una URL en base al estandar RFC3986

		// http://tools.ietf.org/html/rfc3986
		// http://jmrware.com/articles/2009/uri_regexp/URI_regex.html (regex_rfc3986_*)

		regex_rfc3986_schema: /^[a-z][\w+\-.]*$/i,
		regex_rfc3986_userinfo: /^(?:[\w\-._~!$&'()*+,;=:]|%[0-9A-Fa-f]{2})*$/,
		regex_rfc3986_host: /^(?:\[(?:(?:(?:(?:[0-9A-Fa-f]{1,4}:){6}|::(?:[0-9A-Fa-f]{1,4}:){5}|(?:[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){4}|(?:(?:[0-9A-Fa-f]{1,4}:){0,1}[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){3}|(?:(?:[0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){2}|(?:(?:[0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})?::[0-9A-Fa-f]{1,4}:|(?:(?:[0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})?::)(?:[0-9A-Fa-f]{1,4}:[0-9A-Fa-f]{1,4}|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))|(?:(?:[0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})?::[0-9A-Fa-f]{1,4}|(?:(?:[0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})?::)|[Vv][0-9A-Fa-f]+\.[\w\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|(?:[\w\-._~!$&'()*+,;=]|%[0-9A-Fa-f]{2})*)$/,
		regex_rfc3986_port: /^\d+$/,

		// La validación del atributo `pathname` y `query` es innecesaria, ya que la función encodeURI se encarga de normalizarla

		// regex_rfc3986_path: /^(?:(?:\/(?:[\w\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*|\/(?:(?:[\w\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})+(?:\/(?:[\w\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*)?|(?:[\w\-._~!$&'()*+,;=@]|%[0-9A-Fa-f]{2})+(?:\/(?:[\w\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*|(?:[\w\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})+(?:\/(?:[\w\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*|)$/,

		// regex_rfc3986_query: /^(?:[\w\-._~!$&'()*+,;=:@\/?]|%[0-9A-Fa-f]{2})*$/,

		// Normalización de los atributos de una URL

		protocol: function(input) {

			// Nos deshacemos del caracter final `:` para su validación

			var size = (input = _toString(input)).length;

			input = (input.substr(size-1, 1) === ':') ? input.substr(0, input.length-1) : input;

			// Si el protocolo es correcto añadimos `:` al final del mismo
			// si no lo es devolvemos una cadena vacía

			return Public.normalize.regex_rfc3986_schema.test((input = input.toLowerCase())) ? (input + ':') : '';

		},

		auth: function(input) {

			// Si la entrada no es válida deacuerdo al estandar devolvemos una cadena vacía

			return Public.normalize.regex_rfc3986_userinfo.test(input = _toString(input)) ? input : '';

		},

		host: function(input) {

			var port = '', hostname;

			input = _toString(input).split(':');

			// Si se encuentra el caracter `:`

			if (input.length > 1) {

				// Obtenemos el puerto y el nombre del `host`

				port = Public.normalize.port(input.pop());

				// Si el nombre del `host` no es correcto no habrá puerto

				if (!(hostname = Public.normalize.hostname(input.join(':'))))

					port = '';

			} else {

				// Si no se ecuentra el caracter de delimitación no habrá puerto

				hostname = Public.normalize.hostname(input.shift());

			}

			// Devolvemos los atributos `hostname` y `port` normalizados

			return {

				hostname: hostname,

				port: port

			};

		},

		hostname: function(input) {

			// Si la entrada no es válida deacuerdo al estandar devolvemos una cadena vacía

			return Public.normalize.regex_rfc3986_host.test(input = _toString(input).toLowerCase()) ? input : '';

		},

		port: function(input) {

			// Si la entrada no es válida deacuerdo al estandar devolvemos una cadena vacía

			return Public.normalize.regex_rfc3986_port.test(input = _toString(input)) ? input : '';

		},

		pathname: function(input) {

			// Decodificamos y volvemos a codificar caracteres especiales en la entrada de forma segura

			try {

				input = encodeURI(decodeURI(_toString(input)));

			} catch(e) {

				input = '';

			}

			var items = input.split('/'),
				index = items.length,
				result = [],
				back = 0;

			while (index--) {

				// Retroceso de carpeta

				if (items[index] === '..') {

					back++;

				// Si solo contiene un punto es ignorado

				} else if (items[index] !== '.') {

					if (!back) {

						result.unshift(items[index]);

					} else {

						back--;

					}

				}

			}

			// Si la carpeta comenzaba con una barra, por mucho retroceso que haya, tendrá que comenzar con una barra

			return ((result = result.join('/')).substr(0, 1) !== '/' && input.substr(0, 1) === '/') ? ('/' + result) : result;


		},

		search: function(input) {

			return _normalizeQuery.apply(this, ['search', input]);


		},

		hash: function(input) {

			return _normalizeQuery.apply(this, ['hash', input]);

		}

	};

	// Crea una nueva instancia con la posibilidad de interactuar con ella antes de llamar a su constructor original

	Public.instance = function(argv, callback) {

		var Foo = function URL(callback) {

			if (typeof callback === 'function')

				callback.call(this);

		};

		argv = (typeof argv === 'object' && argv) ? [].slice.call(argv, 0) : argv;

		return (Foo.prototype = Public.prototype).constructor.apply(

			new Foo(callback), ((argv instanceof Array) ? argv : [])

		);

	};

	// Obtiene la URL de un elemento (form, a, base, link, img, script, iframe)

	Public.getElementURL = function(input) {

		if (!_isElement(input))

			return '';

		var temp = (typeof HTMLElement === 'function') ? (((temp = (input instanceof HTMLFormElement) ? 'action' : (

			((input instanceof HTMLAnchorElement) || (input instanceof HTMLBaseElement) || (input instanceof HTMLLinkElement)) ? 'href' : (

				((input instanceof HTMLImageElement) || (input instanceof HTMLScriptElement) || (input instanceof HTMLIFrameElement)) ? 'src' : 0

			)

		))) ? temp : '') : (

			(temp = ((temp = input.nodeName.toLowerCase()) === 'form') ? 'action' : (

				(temp === 'a' || temp === 'base' || temp === 'link') ? 'href' : (

					(temp === 'img' || temp === 'script' || temp === 'iframe') ? 'src' : 0

				)
			)

		) ? temp : '');

		return (

			(typeof input.getAttribute === 'function' || (typeof input.getAttribute === 'object' && input.getAttribute)) &&

			(temp = input.getAttribute(temp))

		) ? temp : '';

	};

	// Convierte un objeto de atributos a una cadena literal URL (object -> string)

	Public.build = function(input, location) {

		var attr = this.unbuild(input, location);

		return (attr.protocol ? (attr.protocol + '//') : (attr.host ? '//' : '')) + (

			// Es necesario el atributo `host` para añadir el atributo `auth`

			(attr.auth && attr.host) ? (attr.auth + '@') : ''

		) + attr.host +

		// Si el atributo `pathname` se encuentra vacío, se trata de una dirección y le acompaña el atributo `search` o `hash`
		// debemos definir el atributo `pathname` como `/` para no corromper la estructura de la URL

		((!attr.pathname && (attr.protocol || attr.host) && (attr.search || attr.hash)) ? '/' : '') +

		(attr.pathname + attr.search + attr.hash);

	};

	// Convierte una cadena literal URL a un objeto de atributos (string -> object)

	Public.unbuild = function(input, location) {

		var normalize = Public.normalize, attr, matches, temp;

		// Si la localización está definida como una instancia URL
		// una cadena literal o un objecto lo convertimos a un objecto de atributos normalizados

		location = (location instanceof Public) ?

			location.attr() : (

				(location && ((temp = typeof location) === 'string' || temp === 'object')) ?

					Public.unbuild(location) :

					false

			);

		// Si es un elemento HTML

		if (_isElement(input))

			// Extraemos su dirección

			input = Public.getElementURL(input);

		// Si la entrada es una cadena de texo

		if (typeof input === 'string') {

			// Decodificamos y codificar la entrada para que los caracteres no válidos queden codificados

			input = encodeURI(decodeURI(input));

			// Clasificamos cada una de las partes de la URL

			if (!(matches = input.match(Public.normalize.regexp_split)))

				matches = [];

			// Normalización de los atributos

			attr = {

				protocol: normalize.protocol(matches[1]),
				auth: normalize.auth(matches[2]),
				hostname: normalize.hostname(matches[3]),
				port: normalize.port(matches[4]),
				pathname: normalize.pathname(matches[5]),
				search: normalize.search(matches[6]),
				hash: normalize.hash(matches[7])

			};

		// Si es una instancia de URL

		} else if (input instanceof Public) {

			// Obtenemos los atributos

			attr = input.attr();

		} else {

			// Si no es un objeto forzamos a que lo sea

			if (!input || typeof input !== 'object')

				input = {};

			// Normalización de los atributos

			attr = {

				protocol: normalize.protocol(input.protocol),
				auth: normalize.auth(input.auth),
				pathname: normalize.pathname(input.pathname),
				search: normalize.search(input.search),
				hash: normalize.hash(input.hash)

			};

			// El atributo `host` tiene preferencia

			if ('host' in input) {

				attr.hostname = (temp = normalize.host(input.host)).hostname;
				attr.port = temp.port;

			} else if ('hostname' in input) {

				attr.hostname = normalize.hostname(input.hostname);
				attr.port = attr.hostname ? normalize.port(input.port) : '';

			} else {

				attr.hostname = '';
				attr.port = '';

			}

		}

		// Si la localización se encuentra activada

		if (location) {

			// El atributo `host` tiene preferencia

			if ('host' in location) {

				attr._hostname = (temp = normalize.host(location.host)).hostname;
				attr._port = temp.port;

			} else if ('hostname' in location) {

				attr._hostname = normalize.hostname(location.hostname);
				attr._port = attr.hostname ? normalize.port(location.port) : '';

			}

			// Escalonadamente y empezando por el primer atributo hasta llegar al último
			// Si no se encuentra definido el atributo será reemplazado por el de su localización si existe
			// Si se encuentra definido el atributo se terminará el escalonamiento y no habrá más reemplazos por parte de la localización

			if (!attr.protocol) {

				if ('protocol' in location)

					attr.protocol = normalize.protocol(location.protocol);

				if (!attr.hostname) {

					if ('_hostname' in attr)

						attr.hostname = attr._hostname;

					if (!attr.port) {

						if ('_port' in attr)

							attr.port = attr._port;

						if (!attr.auth) {

							if ('auth' in location)

								attr.auth = normalize.auth(location.auth);

							if (!attr.pathname) {

								if ('pathname' in location)

									attr.pathname = normalize.pathname(location.pathname);

								if (!attr.search) {

									if ('search' in location)

										attr.search = normalize.search(location.search);

									if (!attr.hash && 'hash' in location)

										attr.hash = normalize.search(location.hash);

								}

							// Si el atributo `pathname` no empieza con `/`

							} else if ('pathname' in location && attr.pathname.substr(0, 1) !== '/') {

								// Concatenamos los atributos `pathname` eliminando la última carpeta de la localización

								attr.pathname = normalize.pathname(location.pathname).split('/').slice(0, -1).concat(attr.pathname).join('/');

							}

						}

					}
				}

			}

			delete attr._hostname;
			delete attr._port;

		}

		// Generamos el atributo `host` a partir de los atributos `hostname` y `port`

		attr.host = attr.hostname + (attr.port ? (':' + attr.port) : '');

		// Devolvemos los atributos en forma de objeto

		return attr;

	};

	// Convierte un objecto a una cadena de texto tipo `query` ({a: 1, b: 2} -> a=1&b=2)

	Public.param = function(input) {

		var recursive = function(input, prefix) {

			if (!input || typeof input !== 'object')

				return '';

			var result = [],

				expSpace = /%20/g,

				empty = true,

				index, subindex, item, key;

			input = _object2array(input);

			for (index in input) {

				empty = false;
				
				// Si la matriz contiene un objeto se indicará el índice para
				// que no se pierda la referencia de sus descendientes
				
				subindex = (input instanceof Array && !(typeof input[index] === 'object' && input[index])) ? '' : encodeURIComponent(index);
				
				key = prefix ? (prefix + '[' + subindex + ']') : encodeURIComponent(index);

				result.push(

					((item = input[index]) && typeof item === 'object') ?

						recursive(item, key) : (

							key.replace(expSpace, '+') + ((

								item = encodeURIComponent(

									(typeof item === 'string' || typeof item === 'number') ? item : ''

								).replace(expSpace, '+')

							) ? ('=' + item) : '')

						)

				);

			}

			if (empty)

				result.push(prefix);

			return result.join('&');

		};

		return recursive(input);

	};

	// Convierte una cadena de texto tipo `query` a objecto (a=1&b=2 -> {a: 1, b: 2})

	Public.unparam = function(input) {
		
		// Descartamos entradas que no sean cadenas de texto

		if (typeof input !== 'string')

			return {};

		// Variables de itineración

		var index, size, item,

			subindex, subsize, subitems,

		// Otras variables

			key, value, link, temp, subtemp,

		// Números enteros que no empiecen por cero

			expNumber = /^[0-9]d*/,
					
			isNumber = function(n) {
				
				// Es un número válido, no empieza por 0X (ej: 02) y solo contiene números y puntuación
				
				return !isNaN(parseFloat(n)) && isFinite(n) && /^(?!0\d)/.test(n) && /^[\d\.]+$/.test(n);

			},

		// Nombre de la clave

			expKeyName = /^[^\[]+/,

		// Anidaciones de la clave

			expKeyNodes = /\[(.*?)\]/g,

		// Espacios

			expSpaces = /\+/g,

		// Contenedor de resultado

			result = {};

		// Recorremos los conjuntos nombre=valor

		for (index = 0, size = (input = (input).split(/&+/)).length; index < size; ++index) {

			// Descartamos cadenas vacías

			if (!(item = input[index]))

				continue;
			
			// 1+1+1=2+1 -> 1 1 1=2 1
			
			item = item.replace(expSpaces, ' ');
			
			// Obtenemos el nombre de la clave y su valor
			
			try {
				
				key = decodeURIComponent((temp = item.split('=')).shift());
				
			} catch(e) {
				
				continue;
				
			}
			
			try {
				
				value = decodeURIComponent(temp.join('=').replace(expSpaces, ' '));
				
			} catch(e) {
				
				continue;
			}

			// El nombre de la clave no ha de empezar por [

			if (!(temp = key.match(expKeyName)))

				continue;

			// Obtenemos el nombre de la clave (reemplazamos los espacios)

			subitems = key;
			key = temp[0];

			// Comprobamos si tiene anidaciones

			if ((subitems = subitems.match(expKeyNodes))) {

				if (!result[key])

					result[key] = {};

				// Enlazamos desde el nivel inicial

				link = result[key];

				// Recorremos las anidaciones

				for (subindex = 0, subsize = subitems.length; subindex < subsize; ++subindex) {

					// Si el nombre de la animación se encuentra vacío

					if (!(item = (item = subitems[subindex]).substr(1, item.length-2))) {

						// Obtenemos el número más alto de las claves del objecto `link` y le sumamos uno

						item = subtemp = 0;

						for (temp in link) {
							
							temp = Number(temp);

							if (expNumber.test(temp) && temp >= item) {

								item = temp;
								subtemp = 1;

							}

						}

						if (subtemp)

							++item;

					}

					item = decodeURIComponent((item+'').replace(expSpaces, ' '));

					// Si se trata del último nivel

					if (subindex === subsize-1) {

						// Establecemos su valor final

						link[item] = isNumber(value) ? Number(value) : value;

					} else {

						// Si la anidación no existe se crea

						if (!link[item])

							link[item] = {};

						// Reenlazamos al nuevo nivel

						link = link[item];

					}


				}


			} else {

				result[key] = isNumber(value) ? Number(value) : value;

			}

		}

		// Convertimos los objetos con índice numérico en serie a matrices

		temp = function(input) {

			for (var index in input)

				if (typeof input[index] === 'object' && input[index])

					temp(input[index] = _object2array(input[index]));

		};

		temp(result);

		return result;

	};

	// Funciones privadas utilizadas para no repetir código

	function _toString(i) {

		return (typeof i === 'string' || typeof i === 'number') ? ('' + i) : '';

	}

	function _prototypeQuery(type, name, value) {

		var size = arguments.length-1,

			query = Public.unparam(this.attr(type).substr(1));

		if (!size) { // query()

			// Devolvemos el atributo en forma de objeto

			return query;

		} else if (size === 1) {

			// Si es un objeto

			if (name && typeof name === 'object') { // query({})

				// Reemplazamos el atributo entero

				this.attr(type, name);

			} else { // query('name')

				// De lo contrario devolvemos el valor del atributo solicidado

				return query[name];

			}

		} else if (size === 2) {

			// Si el valor es `null`

			if (value === null) { // query('name', null)

				// Eliminamos el valor

				delete query[name];

			} else { // query('name', 'value')

				// De lo contrario establecemos el nuevo valor

				query[name] = value;

			}

			// Actualizamos el atributo

			this.attr(type, query);

		}

		return this;

	}

	function _prototypeSelect(attributes, name) {

		// Obtenemos los atributos actuales

		var attr = Public.unbuild(this._attributes, (this.location instanceof Public) ? this.location._attributes : false),

		// Contenedor de atributos

			result = {},

		// Marcador

			ready = false,

		// Itineración

			index = 0,

			size = attributes.length,

			item;

		// Convertimos el nombre a cadena de texto

		name = _toString(name).toLowerCase();

		// Si el límite se encuentra en el atributo `hostname`

		if (name === 'hostname') {

			// Eliminamos el puerto y el atributo `host` que también contiene el puerto

			delete attr.host;
			delete attr.port;

		}

		// Recorremos los atributos seleccionados

		for (index; index < size; ++index) {

			// Nombre del atributo

			item = attributes[index];

			// Si el marcador se encuentra desactivado

			if (!ready) {

				// Guardamos el atributo

				if (item in attr)

					result[item] = attr[item];

				// Si ha llegado a la posición límite

				if (item === name)

					// Activamos el marcador para que deje de guardar

					ready = true;

			}

		}

		// Devolvemos la URL construida con los atributos seleccionados

		return Public.build(result);

	}

	function _normalizeQuery(type, input) {

		var str = (type === 'hash') ? '#' : '?';

		// Si la entrada es un objecto

		if (input && typeof input === 'object') {

			// Convertimos la entrada al formato literal `query`

			input = Public.param(input);

		} else {

			// De lo contrario forzamos a que sea literal y nos deshacemos del primer carácter si es el buscado

			input = ((input = _toString(input)) && input.substr(0, 1) === str) ? input.substr(1) : input;

		}

		// Decodificamos y volvemos a codificar caracteres especiales en la entrada de forma segura

		try {

			input = encodeURI(decodeURI(input));

		} catch (e) {

			input = '';

		}

		return input ? (str + decodeURI(input)) : '';

	}

	// Convierte un objeto con claves númericas en serie (0, 1, 2, ...) a una matriz

	function _object2array(input) {

		var index,
			subindex = 0,
			result = [];

		if (typeof input !== 'object' || !input)

			return input;

		for (index in input) {

			if (subindex++ !== Number(index))

				return input;

			result.push(input[index]);

		}

		return result;

	}

	// Comprueba si el objeto es un elemento HTML

	function _isElement(input) {

		return (typeof HTMLElement === 'function') ?

			(input instanceof HTMLElement) :

			(input && typeof input === 'object' && input.nodeType === 1 && typeof input.nodeName === 'string');

	}

	// Acceso público a la clase (navegador y NodeJS)

	return isNode ? (module.exports = Public) : (window[publicName] = Public);

})((typeof module === 'object' && module && typeof module.exports === 'object' && module.exports));