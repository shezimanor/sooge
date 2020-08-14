/**
 * Author: Ryan Chen
 * Reference: Hank Hsiao
 * extents Particle
 */

var GameObject = (function() {

	var Constructor = function(ctx, x, y, img) {
		Particle.call(this, x, y); // super(x, y, speed, direction, gravity)
		this.ctx = ctx;
		this.img = img;
		this._init();
	};

	Constructor.prototype = Object.create(Particle.prototype);
	Constructor.prototype.constructor = Constructor;

	Constructor.prototype._init = function() {
		this.isRotate = true; 
		this.alive = true;
		this.angle = 0;
		this.scale = {
			x: 1,
			y: 1
		};
		this.anchor = {
			x: .5,
			y: .5
		};
		this.width = this.img.width * this.scale.x;
		this.height = this.img.height * this.scale.y;
		this.aabb = false;
	};

	Constructor.prototype.reset = function(x, y, img) {
		this.x = x;
		this.y = y;
		this.img = img;
		this.vx = 0;
		this.vy = 0;
		this.isRotate = true;
		this.alive = true;
		this.angle = 0;
		this.width = this.img.width * this.scale.x;
		this.height = this.img.height * this.scale.y;
	};

	Constructor.prototype.setRotation = function(bool) {
		this.isRotate = bool || true;
	};

	Constructor.prototype.setAnchor = function(x, y) {
		if (arguments.length === 1) {
			this.anchor.x = this.anchor.y = x;
		} else {
			this.anchor.x = x;
			this.anchor.y = y;
		}
	};

	Constructor.prototype.setScale = function(x, y) {
		if (arguments.length === 1) {
			this.scale.x = this.scale.y = x;
		} else {
			this.scale.x = x;
			this.scale.y = y;
		}
	};

	Constructor.prototype.update = function() {
		Particle.prototype.update.call(this);
		this.width = this.img.width * this.scale.x;
		this.height = this.img.height * this.scale.y;
		this.left = this.x - this.width * this.anchor.x;
		this.top = this.y - this.height * this.anchor.y;
		this.right = this.left + this.width;
		this.bottom = this.top + this.height;
	};

	Constructor.prototype.draw = function() {
		this.ctx.save();
		this.ctx.translate(this.x, this.y);
		if (this.isRotate) this.ctx.rotate(this.angle);
		this.ctx.drawImage(
			this.img,
			0,
			0,
			this.img.width,
			this.img.height,
			-this.width * this.anchor.x,
			-this.height * this.anchor.y,
			this.width,
			this.height);
		// show aabb box outline
		if (this.aabb) {
			this.ctx.beginPath();
			this.ctx.rect(
				-this.width * this.anchor.x,
				-this.height * this.anchor.y,
				this.width,
				this.height);
			this.ctx.closePath();
			this.ctx.stroke();
		}     
		this.ctx.restore();
	};

	Constructor.prototype.kill = function() {
		this.alive = false;
	};

	return Constructor;
})();