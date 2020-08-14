/**
 * Author: Ryan Chen
 * extents Particle
 */

var SpriteGameObject = (function() {

	var Constructor = function(ctx, x, y, imgs, settings) {
    var defaultSettings = {
      fps: 12,
      imgStartIndex: 0,
      imgEndIndex: imgs.length -1,
			repeat: -1,
			stopAndDie: true
    };
		Particle.call(this, x, y); // super(x, y, speed, direction, gravity)
		this.ctx = ctx;
    this.imgs = imgs;
    this.settings = utils.deepCopy(settings, defaultSettings);
    this.currentFrame = 0;
    this.currentRepeat = 0;
    this.isPlaying = false;
    this.totalFrames = this.settings.imgEndIndex - this.settings.imgStartIndex + 1;
		this._init();
  };

	Constructor.prototype = Object.create(Particle.prototype);
  Constructor.prototype.constructor = Constructor;
  
  // observer.js
  Observer(Constructor.prototype);

	Constructor.prototype._init = function() {
    this.img = this.imgs[this.settings.imgStartIndex].img;
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
		if (!this.alive) return;
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
  
  Constructor.prototype._controlAnimation = function () {
    var key = this.currentFrame + this.settings.imgStartIndex;
    // set currentFrame
    this.img = this.imgs[key].img;
    // next round settings
    this.currentFrame++;

    if (this.currentFrame >= this.totalFrames) {
      if (this.settings.repeat !== 0 && (this.currentRepeat <= this.settings.repeat || this.settings.repeat === -1)) {
        this.currentFrame = 0;
        this.currentRepeat++;
      } else {
				this.stop();
				if(this.settings.stopAndDie) this.kill();
      }
    }
  }

  Constructor.prototype._controlTimer = function () {
    var speed = 1000 / this.settings.fps;
    if (this.settings.duration !== undefined) {
      speed = this.settings.duration / this.totalFrames;
    }
    this.timer = setInterval(this._controlAnimation.bind(this), speed);
  };

  Constructor.prototype.play = function () {
    if (this.isPlaying) clearInterval(this.timer);
    this.trigger('play');
    this.currentFrame = 0;
    this.currentRepeat = 1;
    this.isPlaying = true;
    this._controlTimer();
    return this;
  };

  Constructor.prototype.resume = function () {
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.trigger('resume');
      this._controlTimer();
    }
    return this;
  };

  Constructor.prototype.stop = function () {
    if (this.isPlaying) {
      this.isPlaying = false;
      this.trigger('stop');
      clearInterval(this.timer);
    }
    return this;
  };

	return Constructor;
})();