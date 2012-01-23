(function () {

	var colors = ['rgb(8,2,2)', 'rgb(2,2,8)', 'rgb(8,8,2)', 'rgb(2,8,2)', 'rgb(8,2,8)', 'rgb(2,8,8)'];
	
	Labs.onupdate.push(function () {
		return '# ' + Particles.stack.length;
	});
	
	Labs.ontick.render = function () {
		var ctx = this.context,
			beta;
		
		ctx.globalCompositeOperation = 'lighter';
		Particles.each(function (p) {
			ctx.beginPath();
			ctx.arc(p.x, p.y, p.age / 50, 0, Math.PI * 2, true);
			ctx.closePath();
			ctx.strokeStyle = colors[p.color];
			ctx.stroke();

			if ((p.age % 5) === 0) {
				beta = (0.5 - Math.random()) * p.beta;
				p.vx = Math.sin(p.alpha + beta);
				p.vy = Math.cos(p.alpha + beta);

				p.beta *= 0.999;
				p.speed *= 1.001;
			}
		});

		if (!Particles.advance(this.canvas.width, this.canvas.height)) {
			Timer.stop();
		}
	};

	Labs.clickObserver.observe('add', function (x, y) {
		var i = 256,
			alpha;

		for (; i; i -= 1) {
			alpha = Math.random() * 2 * Math.PI;
			Particles.add(x, y, {
				alpha: alpha,
				beta: Math.random() * 2 * Math.PI,

				vx: Math.sin(alpha),
				vy: Math.cos(alpha),

				speed: 1 + Math.random(),
				color: Math.floor(Math.random() * colors.length)
			});
		}
	});

	Labs.keyObserver.observe('space', function () {
		Canvas.clear(Labs.canvas, 'black');
		Particles.clear();
		Timer.stop();
	});

}());
