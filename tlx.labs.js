(function () {

	// Check for a decent browser
	if (!document.createElement('canvas').getContext || !document.querySelector
			|| !Array.prototype.forEach || !Array.prototype.map) {
		document.getElementsByTagName('body')[0].innerHTML = 'Get a decent browser...';
		throw ('Eww, outdated browser');
	}

	// Internet Explorer...
	if (!document.addEventListener) {
		document.addEventListener = document.attachEvent || function (event, callback) {
			document['on' + event] = callback;
		};
	}

	var Labs = {
		canvas: false,
		context: false,

		ontick: {},
		onupdate: [],

		hud: document.querySelector('#hud'),

		debug: (/[\?|&]debug/.test(document.location))
	};

	Labs.curry = function (fn, scope) {
		var args = [],
			i = 2,
			len = arguments.length;
		for (; i < len; i += 1) {
			args.push(arguments[i]);
		}

		return function () {
			var a = [],
				i = 0,
				len = arguments.length;
			for (; i < len; i += 1) {
				a.push(arguments[i]);
			}
			fn.apply(scope || window, args.concat(a));
		};
	};

	Labs.add_keyObserver = function () {
		Labs.keyObserver.observe('?', function () {
			Labs.debug = !Labs.debug;
			Labs.hud.style.display = Labs.debug ? '' : 'none';
		});
		Labs.keyObserver.init();		
	};
	
	Labs.add_clickObserver = function () {
		Labs.clickObserver.observe('info', function () {
			Labs.clickObserver.stop('info');

			var info = document.querySelector('#info');
			info.style.opacity = 1;

			Timer.ontick.hideInfo = function () {
				info.style.opacity -= 0.02;

				if (info.style.opacity < 0.1) {
					info.parentNode.removeChild(info);
					delete Timer.ontick.hideInfo;
				}
			};

			if (Labs.debug) {
				Labs.hud.style.display = '';
			}
		});
		Labs.clickObserver.observe('start', Timer.start);
		Labs.clickObserver.init();		
	};

	Labs.add_mainloop = function () {
		Timer.ontick.labs = function (timestamp) {
			var key,
				fps,
				messages = [];

			for (key in Labs.ontick) {
				if (Labs.ontick.hasOwnProperty(key)) {
					Labs.curry(Labs.ontick[key], Labs, timestamp)();
				}
			}

			// Update the hud only if visible
			if (Labs.debug) {
				fps = Timer.ticks / (((new Date()).getTime() - Timer.start_time) / 1000);

				Labs.onupdate.forEach(function (fn) {
					messages.push(fn.call(Labs));
				});
				messages.push('$ ' + (Timer.running ? (Timer.ticks > 100 ? Math.floor(fps) : '??') : '-'));
				Labs.hud.innerHTML = messages.join(', ');

				Labs.hud.style.background = Timer.running ? '#484' : '#844';
			}
		};		
	};
	
	Labs.add_detailAnimation = function () {
		var storage = false,
			animation = function (direction, timestamp) {
				if (!storage) {
					storage = {
						element  : document.querySelector('footer'),
						initial  : -60,
						max      : 40,
						current  : 0,
						last     : 0,
						direction: 0,
						speed_fac: 5
					};
				}

				timestamp = timestamp || (new Date()).getTime();

				var duration = storage.last ? timestamp - storage.last : 0;
				storage.last = 0;

				if (direction) {
					storage.direction = direction;
				}

				storage.current += duration / storage.speed_fac * storage.direction;
				if ((storage.current >= 0) && (storage.current <= storage.max)) {
					window.requestAnimationFrame(Labs.curry(animation, this, 0));
					storage.last = timestamp;
				}

				storage.current = Math.max(0, Math.min(storage.max, storage.current));
				storage.element.style.marginBottom = Math.round(storage.current + storage.initial) + "px";

			};

		document.querySelector('footer').addEventListener('mouseover', function (event) {
			if (!event.relatedTarget || event.relatedTarget.nodeName === 'CANVAS') {
				animation(1);
			}
		});

		document.querySelector('footer').addEventListener('mouseout', function (event) {
			if (!event.relatedTarget || event.relatedTarget.nodeName === 'CANVAS') {
				animation(-1);
			}
		});
	};

	Labs.init = function () {
		// See if everything got loaded
		if (!Canvas || !Timer) {
			document.querySelector('body').innerHTML = 'Missing neccessary objects...';
			throw ('Load error');
		}

		Labs.add_keyObserver();
		Labs.add_clickObserver();
		Labs.add_mainloop();
		Labs.add_detailAnimation();

		// Create and add canvas
		Labs.canvas = Canvas.create(window.innerWidth, window.innerHeight);
		Labs.context = Canvas.getContext(Labs.canvas);
		Canvas.clear(Labs.canvas, 'black');

		var body = document.querySelector('body');
		body.appendChild(Labs.canvas);
		body.className = 'js';
	};

	Labs.addScript = function (uri, opts) {
		opts = opts || {};
		if (typeof opts === 'function') {
			opts = {complete: opts};
		}

		if (typeof uri === 'string' || !uri.length) {
			uri = [uri];
		}

		var queue = uri.length,
			onload = function () {
				queue -= 1;
				if (!queue && opts.complete) {
					opts.complete();
				}
			};
		uri.forEach(function (uri) {
			var s = document.createElement('script');
			s.type = 'text/javascript';
			s.async = opts.async || false;
			s.src = uri;
			s.onload = onload;
			s.onerror = onload;
			document.getElementsByTagName('head')[0].appendChild(s);
		});
	};

	window.Labs = Labs;

}());