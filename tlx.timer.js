(function () {
	// shim layer with setTimeout fallback
	// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	window.requestAnimationFrame = (function () {
		return window.requestAnimationFrame    ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
			window.oRequestAnimationFrame      ||
			window.msRequestAnimationFrame     ||
			function (callback) {
				window.setTimeout(callback, 1000 / 60);
			};
	}());

	var Timer = {
		running: false,
		ticks: 0,
		ontick: {},

		start_time: false,
		stop_time: false
	};
	
	Timer.start = function () {
		Timer.start_time = Timer.start_time || (new Date()).getTime();

		if (Timer.stop_time) {
			Timer.start_time = (new Date()).getTime() - (Timer.stop_time - Timer.start_time);
			Timer.stop_time = false;
		}

		if (!Timer.running) {
			Timer.running = true;
			Timer.tick();
		}
	};
	
	Timer.stop = function () {
		Timer.stop_time = (new Date()).getTime();
		Timer.running = false;
	};
	
	Timer.tick = function (timestamp) {
		var key;

		Timer.ticks += 1;

		for (key in Timer.ontick) {
			if (Timer.ontick.hasOwnProperty(key)) {
				Timer.ontick[key](timestamp);
			}
		}

		if (Timer.running) {
			window.requestAnimationFrame(Timer.tick, Timer);
		}
	};

	window.Timer = Timer;
}());
