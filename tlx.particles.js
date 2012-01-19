(function () {
	var Particles = {stack: []};
	
	Particles.add = function (x, y, options) {
		var particle = {x: x, y: y, age: 0},
			key;
		for (key in options) {
			if (options.hasOwnProperty(key)) {
				particle[key] = options[key];
			}
		}
		Particles.stack.push(particle);

		if (Particles.stack.length > 4096) {
			Particles.stack = Particles.stack.slice(-4096);
		}
	};
	
	Particles.clear = function () {
		Particles.stack = [];
	};
	
	Particles.advance = function (max_width, max_height, alive_func) {
		var temp = [],
			alive;
		Particles.each(function (p) {
			p.x += p.vx * p.speed;
			p.y += p.vy * p.speed;
			p.age += 1;


			alive = true;
			alive = alive && (p.x + p.age / 50 >= 0);
			alive = alive && (p.x - p.age / 50 < max_width);
			alive = alive && (p.y + p.age / 50 >= 0);
			alive = alive && (p.y - p.age / 50 < max_height);
			if (typeof alive_func === 'function') {
				alive = alive && alive_func(p);
			}
			if (alive) {
				temp.push(p);
			}
		});
		Particles.stack = temp;
		
		return Particles.stack.length > 0;
	};
	
	Particles.each = function (callback) {
		if (typeof callback !== 'function') {
			throw ('Given callback is not a function');
		}
		
		Particles.stack.forEach(callback);
	};

	window.Particles = Particles;

}());

