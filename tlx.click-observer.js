/**
 * Click Observer
 */
(function (window) {
	
	var clickObserver = {},
		observers = {};
		
	clickObserver.init = function () {
		document.addEventListener('click', clickObserver.observer);			
	};
	
	clickObserver.observe = function (key, observer) {
		observers[key] = observer;
	};
	
	clickObserver.stop = function (key) {
		delete observers[key];
	};
	
	clickObserver.observer = function (event) { // private?
		if (event.target.nodeName === 'A') {
			return;
		}

		var key;
		for (key in observers) {
			if (observers.hasOwnProperty(key)) {
				observers[key](event.clientX, event.clientY);
			}
		}
	};
	
	window.clickObserver = clickObserver;
	
}(Labs || window));