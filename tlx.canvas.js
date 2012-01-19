(function () {

	var Canvas = {};

	Canvas.create = function (width, height) {
		var canvas = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;
		return canvas;
	};

	Canvas.clear = function (canvas, color) {
		var context = Canvas.getContext(canvas);
		context.globalCompositeOperation = 'source-over';
		context.fillStyle = color;
		context.fillRect(0, 0, canvas.width, canvas.height);
	};

	Canvas.getContext = function (canvas, context) {
		return canvas.getContext(context || '2d');
	};

	window.Canvas = Canvas;
	
}());