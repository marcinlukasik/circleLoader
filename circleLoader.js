/***************************************************************************************************
*** Name: circleLoader
*** Version: 1.0.0
*** Author: Marcin Łukasik
*** Site: http://marcinlukasik.me
*** MIT Licensed
****************************************************************************************************/

/*** Animation Frame
****************************************************************************************************/
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

/*** Circle loader
****************************************************************************************************/
var circleLoader = function(set) {

	function extend(a, b) {
	    for(var key in b)
	        if(b.hasOwnProperty(key))
	            a[key] = b[key];
	    return a;
	}

	set = extend({
		interval: 2000,
		gradient: [0, 0, 0, 150],
		addColorStop: [[ 0, '#00ABEB' ], [ 0.5, '#00ABEB' ], [ 0.5, '#66CC00' ], [ 1, '#66CC00' ]],
		arc: [75, 75, 60, 1.5],
		lineWidth: 15,
		bgColor: [false, 'yellow', 1],
		bgImage: [false, 'canvas.jpg', -78, -5, 1],
		behindStrokeBg: [false, 'yellow', 0.2],
		opacity: 1,
		interval: 1000,
		unitFrames: 0.02,
		endProgress: 100,
		stopAnimation: [false, 'click', 'body'],
		hide: [false, 'CL-opacity'],
		fontActive: false,
		font: 'bold 16pt Calibri',
		fontColor: '#66CC00'
	}, set);

	var c = document.getElementById(set.identifier),
		ctx = c.getContext("2d"),
		colors = ctx.createLinearGradient(set.gradient[0], set.gradient[1], set.gradient[2], set.gradient[3]);

	for(var i in set.addColorStop) {
		colors.addColorStop(set.addColorStop[i][0], set.addColorStop[i][1]);
	}

	ctx.lineWidth = set.lineWidth;

	// Overrite global variables - important
	var then = Date.now(),
		startClock = set.arc[3],
		startText = 0,
		requestId;

	var circle = {

		calcProcent: function(proc) {
			return  2 - (proc * set.unitFrames);
		},

		drawCircle: function(addFrames) {
			ctx.beginPath(); 
			ctx.strokeStyle = colors;
			ctx.globalAlpha = set.opacity;
			ctx.arc(set.arc[0], set.arc[1], set.arc[2], set.arc[3] * Math.PI, (addFrames) * Math.PI);
			ctx.stroke();
		},

		drawBg: function() {
			if(set.bgColor[0] === true) {
				ctx.beginPath();
				ctx.fillStyle = set.bgColor[1];  
				ctx.globalAlpha = set.bgColor[2];
				ctx.arc(set.arc[0], set.arc[1], set.arc[2] - (set.lineWidth / 2), 0, Math.PI * 2, true);
				ctx.fill();
			}
		},

		drawImageBg: function() {
			if(set.bgImage[0] === true) {
				ctx.save();
				ctx.beginPath();
				ctx.arc(set.arc[0], set.arc[1], set.arc[2] - (set.lineWidth / 2), 0, Math.PI * 2, true);
				ctx.clip();
				ctx.globalAlpha = set.bgImage[4];
				base_image = new Image();
				base_image.src = set.bgImage[1];
				ctx.drawImage(base_image, set.bgImage[2], set.bgImage[3]);
				ctx.restore();
			}
		},

		drawText: function(addStep) {
			if(set.fontActive === true) {
				ctx.globalAlpha = set.opacity;
				ctx.font = set.font;
				ctx.textAlign = 'center';
				ctx.textBaseline= 'middle'; 
				ctx.fillStyle = set.fontColor;
				ctx.fillText(parseInt(100 * (addStep)/2) + '%', c.width / 2, c.height / 2);
			}
		},

		behindStrokeBg: function() {
			if(set.behindStrokeBg[0] === true) {
				ctx.beginPath();
				ctx.globalAlpha = set.behindStrokeBg[2];
				ctx.strokeStyle = set.behindStrokeBg[1];
				ctx.arc(set.arc[0], set.arc[1], set.arc[2], 0,2 * Math.PI);
				ctx.stroke();
			}
		},

		cancelAnimate: function() {
			if(set.stopAnimation[0] === true) {
				document.querySelector(set.stopAnimation[2]).addEventListener(set.stopAnimation[1], function() {
					window.cancelAnimationFrame(requestId);
				}, false);
			}
		},

		endClock: function() {
			var endClock = set.arc[3] - circle.calcProcent(set.endProgress),
				end = (endClock + 2);
			return end;
		},

		hideCanvas: function() {
			if(set.hide[0] === true) {
				if((set.endProgress * 0.02).toFixed(2) === startText.toFixed(2)) {
					c.classList.add(set.hide[1]);
				}
			}
		},

		animate: function() {

		    var now = Date.now(),
		    	delta = now - then,
		    	fps = 60,
				interval = set.interval / fps;
		     
		    if (delta > interval) {
		        then = now - (delta % interval);

		        if(startClock <= circle.endClock()) {
					ctx.clearRect(0, 0, c.width, c.height);
					circle.behindStrokeBg();
					circle.drawBg();
					circle.drawImageBg();
					circle.drawText(startText += set.unitFrames);
					circle.drawCircle(startClock += set.unitFrames);
		        }
		    }
		    if(startClock <= circle.endClock()) {
		    	requestId = window.requestAnimationFrame(circle.animate);
		    }
			circle.hideCanvas();
		}
	}
	circle.animate();
	circle.cancelAnimate();	
};