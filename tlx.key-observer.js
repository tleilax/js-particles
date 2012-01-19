(function (window) {

	var keyObserver = {},
		observers = {};

	function adjust(charcode) {
		if (typeof charcode === 'string') {
			charcode = charcode.toLowerCase();
			if (keyObserver.mapping.hasOwnProperty(charcode)) {
				charcode = keyObserver.mapping[charcode];
			} else if (charcode.length === 1) {
				charcode = charcode.charCodeAt(0);
			} else {
				charcode = parseInt(charcode, 10);
			}
		}

		return charcode;
	}

	keyObserver.mapping = {
		'esc': 27,
		'space': 32,
		'up': 38,
		'down': 40,
		'left': 37,
		'right': 39
	};

	keyObserver.init = function () {
		document.addEventListener('keypress', keyObserver.observer);
	};

	keyObserver.observe = function (charcode, observer) {
		observers[adjust(charcode)] = observer;
	};

	keyObserver.stop = function (charcode) {
		delete observers[adjust(charcode)];
	};

	keyObserver.observer = function (event) { // private?
		var charCode = event.charCode || event.keyCode;
		if (observers.hasOwnProperty(charCode)) {
			return observers[charCode]();
		} else if (console.log) {
			console.log(charCode, event);
		}
	};

	window.keyObserver = keyObserver;

}(Labs || window));