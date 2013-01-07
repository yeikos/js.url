/*!
 * @name JavaScript/NodeJS URL v1.0.1
 * @autor yeikos
 
 * Copyright 2013 - https://github.com/yeikos/js.url
 * GNU General Public License
 * http://www.gnu.org/licenses/gpl-3.0.txt
 */

;(function(node, undefined) {

	var Public = function URL(url, location) {

		// Si la instancia no ha sido creada, creamos una nueva

		var self = (this instanceof URL) ? this : new Public(false);

		// Inicializamos el objeto contenedor de atributos

		self._attributes = {};

		// Si el único argumento recibido es `false` no operamos sobre la instancia

		if (arguments.length === 1 && url === false)

			return self;
		
		// Definimos la instancia `location`

		self.location = new Public(false);

		// Establecemos la URL

		if (location !== undefined)

			self.location.href(location);

		if (url !== undefined)

			self.href(url);

		return self;
	
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

				return Public.build(this._attributes, (this.location instanceof Public) ? this.location._attributes : false);

			// Si el parámetro es `null`

			} else if (input === null) {

				// Vaciamos los atributos

				this._attributes = {};

			// Si el parámetro es una cadena de texto o un objecto

			} else if ((temp = typeof input) === 'string' || (input && temp === 'object')) {

				// Si es un elemento HTML

				if (typeof HTMLElement === 'function' && input instanceof HTMLElement)

					// Extraemos su URL

					input = Public.getElementURL(input);

				// Deconstruimos la URL y guardamos su información en forma de objeto

				this._attributes = Public.unbuild(input, (this.location instanceof Public) ? this.location._attributes : false);

			}

			return this;

		},

		// Atributos

		attr: function(name, value) {

			var temp = arguments.length;

			// Si no hay parámetros

			if (!temp) {

				// Devolvemos una copia sin referencias de los atributos actuales

				var buffer = {};

				for (temp in this._attributes)

					buffer[temp] = Public.toString(this._attributes[temp]);

				return buffer;

			// Si hay un parámetro

			} else if (temp === 1) {

				// Si es una cadena de texto

				if ((temp = typeof name) === 'string') { // get()

					// Devolvemos el valor del atributo en formato literal

					return Public.toString(this._attributes[name.toLowerCase()]);

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

						if (name === 'host' || name === 'hostname') {

							// Si el atributo es `host` actualizamos el `hostname` y el `port` (hostname:port)
							// Si el atributo es `hostname` actualizamos el `host` y dejamos el `port` intacto

							temp = Public.normalize.host(

								Public.toString(value) + (

									(name === 'hostname' && this._attributes.port) ? (':' + this._attributes.port) : ''

								)

							);

							this._attributes.host = temp.hostname + (temp.port ? (':' + temp.port) : '');
							this._attributes.hostname = temp.hostname;
							this._attributes.port = temp.port;
				
						} else {

							// Establecemos el nuevo valor normalizado del atributo

							this._attributes[name] = Public.normalize[name](value);

						}

				}

			}

			return this;

		},

		// Opera con el atributo `search` en forma de objeto

		query: function(name, value) {

			var size = arguments.length,

				query = Public.unparam(this.attr('search').substr(1));

			if (!size) { // query()

				// Devolvemos el atributo `search` en forma de objeto

				return query;

			} else if (size === 1) {

				// Si es un objeto

				if (name && typeof name === 'object') { // query({})

					// Reemplazamos el atributo `search` entero

					this.attr('search', name);

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

				// Actualizamos el atributo `search`

				this.attr('search', query);

			}

			return this;

		},

		// Opera con el atributo `hash` en forma de objeto

		queryHash: function(name, value) {

			var size = arguments.length,

				query = Public.unparam(this.attr('hash').substr(1));

			if (!size) { // queryHash()

				// Devolvemos el atributo `hash` en forma de objeto

				return query;

			} else if (size === 1) {

				// Si es un objeto

				if (name && typeof name === 'object') { // queryHash({})

					// Reemplazamos el atributo `hash` entero

					this.attr('hash', name);

				} else { // queryHash('name')

					// De lo contrario devolvemos el valor del atributo solicidado

					return query[name];

				}

			} else if (size === 2) {

				// Si el valor es `null`

				if (value === null) { // queryHash('name', null)

					// Eliminamos el valor

					delete query[name];

				} else { // queryHash('name', 'value')

					// De lo contrario establecemos el nuevo valor

					query[name] = value;

				}

				// Actualizamos el atributo `hash`

				this.attr('hash', query);

			}

			return this;

		}

	};

	// Atributos válidos de la URL

	Public.attributes = ['protocol', 'auth', 'host', 'hostname', 'port', 'pathname', 'search', 'hash'];

	// Normalización de la URL

	Public.normalize = {

		// http://tools.ietf.org/html/rfc3986
		// http://jmrware.com/articles/2009/uri_regexp/URI_regex.html

		// Clasificación de las partes de una URL

		regexp_split: /^(?:(?:(.+:)?\/\/)(?:(?:(.+)@)?([^\/:]+)(?::([^\/]+))?)?)?(?:(\/?[^?#]*)?(\?[^#]*)?(#.*)?)?/,

		// Validación de las diversas partes de una URL en base al estandar RFC3986

		regex_rfc3986_schema: /^[a-z][\w+\-.]*$/i,
		regex_rfc3986_userinfo: /^(?:[A-Za-z0-9\-._~!$&'()*+,;=:]|%[0-9A-Fa-f]{2})*$/,
		regex_rfc3986_host: /^(?:\[(?:(?:(?:(?:[0-9A-Fa-f]{1,4}:){6}|::(?:[0-9A-Fa-f]{1,4}:){5}|(?:[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){4}|(?:(?:[0-9A-Fa-f]{1,4}:){0,1}[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){3}|(?:(?:[0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){2}|(?:(?:[0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})?::[0-9A-Fa-f]{1,4}:|(?:(?:[0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})?::)(?:[0-9A-Fa-f]{1,4}:[0-9A-Fa-f]{1,4}|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))|(?:(?:[0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})?::[0-9A-Fa-f]{1,4}|(?:(?:[0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})?::)|[Vv][0-9A-Fa-f]+\.[A-Za-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|(?:[A-Za-z0-9\-._~!$&'()*+,;=]|%[0-9A-Fa-f]{2})*)$/,
		regex_rfc3986_port: /^\d+$/,
		regex_rfc3986_path: /^(?:(?:\/(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*|\/(?:(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})+(?:\/(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*)?|(?:[A-Za-z0-9\-._~!$&'()*+,;=@]|%[0-9A-Fa-f]{2})+(?:\/(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*|(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})+(?:\/(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*|)$/,
		regex_rfc3986_query: /^(?:[\w\-._~!$&'()*+,;=:@\/?]|%[0-9A-Fa-f]{2})*$/,

		// Normalización de los atributos de una URL

		protocol: function(input) {

			// Nos deshacemos del caracter final `:` para su validación

			input = ((input =  Public.toString(input)).substr(-1) === ':') ? input.substr(0, input.length-1) : input;

			// Si el protocolo es correcto añadimos `:` al final del mismo
			// si no lo es devolvemos una cadena vacía

			return Public.normalize.regex_rfc3986_schema.test((input = input.toLowerCase())) ? (input + ':') : '';

		},

		auth: function(input) {

			// Si la entrada no es válida deacuerdo al estandar devolvemos una cadena vacía

			return Public.normalize.regex_rfc3986_userinfo.test(input = Public.toString(input)) ? input : '';

		},

		host: function(input) {

			var port = '', hostname;

			input = Public.toString(input).split(':');

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

			return Public.normalize.regex_rfc3986_host.test(input = Public.toString(input)) ? input : '';
			
		},

		port: function(input) {

			// Si la entrada no es válida deacuerdo al estandar devolvemos una cadena vacía

			return Public.normalize.regex_rfc3986_port.test(input = Public.toString(input)) ? input : '';

		},

		pathname: function(input) {

			// Decodificamos y volvemos a codificar caracteres especiales en la entrada de forma segura

			try {

				input = encodeURI(decodeURI(Public.toString(input)));

			} catch(e) {

				input = '';

			}

			// Comprobamos si la entrada es correcta, si no lo es su valor será una cadena vacía

			var test = Public.normalize.regex_rfc3986_path.test(input) ? input : '';

			// Finalmente la entrada comenzará siempre con `/`

			input = test ? ((input.substr(0, 1) !== '/') ? ('/' + input) : input) : '/';

			// Simplificamos posibles repeticiones seguidas del carácter `/`

			return input.replace(/[\/]{2,}/g, '/');

		},

		search: function(input) {

			// Si la entrada es un objecto

			if (input && typeof input === 'object') {

				// Convertimos la entrada al formato literal `query`

				input = Public.param(input);

			} else {

				// De lo contrario forzamos a que sea literal y nos deshacemos del primer carácter si es `?`

				input = ((input = Public.toString(input)) && input.substr(0, 1) === '?') ? input.substr(1) : input;

			}

			// Decodificamos y volvemos a codificar caracteres especiales en la entrada de forma segura

			try {

				input = encodeURI(decodeURI(input));

			} catch (e) {

				input = '';

			}

			// Si la entrada no es válida deacuerdo al estandar devolvemos una cadena vacía

			return (input && Public.normalize.regex_rfc3986_query.test(input)) ? ('?' + decodeURI(input)) : '';

		},

		hash: function(input) {

			// Si la entrada es un objecto

			if (input && typeof input === 'object') {

				// Convertimos la entrada al formato literal `query`

				input = Public.param(input);

			} else {

				// De lo contrario forzamos a que sea literal y nos deshacemos del primer carácter si es `#`

				input = ((input = Public.toString(input)) && input.substr(0, 1) === '#') ? input.substr(1) : input;

			}

			// Decodificamos y volvemos a codificar caracteres especiales en la entrada de forma segura

			try {

				input = encodeURI(decodeURI(input));

			} catch (e) {

				input = '';

			}

			// Si la entrada no es válida deacuerdo al estandar devolvemos una cadena vacía

			return (input && Public.normalize.regex_rfc3986_query.test(input)) ? ('#' + decodeURI(input)) : '';

		}

	};

	// Convierte la entrada en cadena de texto

	Public.toString = function(i) {

		return (typeof i === 'string' || typeof i === 'number') ? ('' + i) : '';

	};

	// Obtiene la URL de un elemento (form, a, base, link, img, script, iframe)

	Public.getElementURL = function(input) {

		var temp;

		return (!(temp = (input instanceof HTMLFormElement) ? 'action' : (

			((input instanceof HTMLAnchorElement) || (input instanceof HTMLBaseElement) || (input instanceof HTMLLinkElement)) ? 'href' : (

				((input instanceof HTMLImageElement) || (input instanceof HTMLScriptElement) || (input instanceof HTMLIFrameElement)) ? 'src' : 0

			)

		))) ? '' : input.getAttribute(temp);

	};

	// Convierte un objeto de atributos a una cadena literal URL (object -> string)

	Public.build = function(input, location) {

		var attr = this.unbuild(input, location);

		return (attr.protocol ? (attr.protocol + '//') : (attr.host ? '//' : '')) + (

			(attr.auth) ? (attr.auth + '@') : ''

		) + attr.host + ((attr.pathname.length === 1 && !attr.search && !attr.hash) ? '' : (attr.pathname + attr.search + attr.hash));

	};

	// Convierte una cadena literal URL a un objeto de atributos (string -> object)

	Public.unbuild = function(input, location) {

		var normalize = Public.normalize, attr, matches, temp;

		// Si la localización está definida como una cadena literal o un objecto lo convertimos a un objecto de atributos normalizados

		location = (location && ((temp = typeof location) === 'string' || temp === 'object')) ?  Public.unbuild(location) : false;

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
				search: normalize.search(matches[6]),
				hash: normalize.hash(matches[7]),

				// Dejamos el atributo `pathname` inctacto para que pueda ser evaluado más tarde

				pathname: Public.toString(matches[5])

			};

		} else {

			if (!input || typeof input !== 'object')

				input = {};

			// Normalización de los atributos

			attr = {

				protocol: normalize.protocol(input.protocol),
				auth: normalize.auth(input.auth),
				search: normalize.search(input.search),
				hash: normalize.hash(input.hash),

				// Dejamos el atributo `pathname` inctacto para que pueda ser evaluado más tarde

				pathname: Public.toString(input.pathname)

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

									attr.pathname = location.pathname;

								if (!attr.search) {

									if ('search' in location)

										attr.search = normalize.search(location.search);

									if (!attr.hash && 'hash' in location)

										attr.hash = normalize.search(location.hash);

								}

							} else {

								if ('pathname' in location) {

									temp = Public.toString(location.pathname);

									// Carpeta relativa si

									// attr.pathname = a
									// location.pathname = /b/

									if ((attr.pathname.substr(0, 1) !== '/' && temp.length > 1 && temp.substr(-1) === '/'))

										attr.pathname = temp + attr.pathname;

								}

							}

						}

					}
				}

			}

			delete attr._hostname;
			delete attr._port;

		}

		// Normalizamos la carpeta

		attr.pathname = normalize.pathname(attr.pathname);

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

				index, item, key;

			for (index in input) {

				empty = false;

				key = prefix ? (prefix + '[' + encodeURIComponent(index) + ']') : encodeURIComponent(index);

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

			key, value, link, temp,

		// Números enteros que no empiecen por cero

			expNumber = /^[1-9]d*/,

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

			// Obtenemos el nombre de la clave y su valor

			key = (temp = item.split('=')).shift();
			value = decodeURIComponent(temp.join('=').replace(expSpaces, ' '));

			// El nombre de la clave no ha de empezar por [

			if (!(temp = key.match(expKeyName)))

				continue;

			// Obtenemos el nombre de la clave (reemplazamos los espacios)

			subitems = key;
			key = decodeURIComponent(temp[0].replace(expSpaces, ' '));

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

						// Obtenemos el número más alto de las claves del objecto `link`

						item = -1;

						for (temp in link)

							if (expNumber.test(temp) && temp > item)

								item = temp;

						++item;

					}

					item = decodeURIComponent((item+'').replace(expSpaces, ' '));

					// Si se trata del último nivel

					if (subindex === subsize-1) {

						// Establecemos su valor final

						link[item] = value;

					} else {

						// Si la anidación no existe se crea

						if (!link[item])

							link[item] = {};

						// Reenlazamos al nuevo nivel

						link = link[item];

					}

				}

			} else {

				result[key] = value;

			}

		}

		return result;

	};

	// Acceso público a la clase (navegador y NodeJS)

	return node ? (module.exports = Public) : (window[publicName] = Public);

})((typeof module === 'object' && module && typeof module.exports === 'object' && module.exports));