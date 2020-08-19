/**
 * Author: Ryan Chen
 * extents Particle
 */

var SpriteGameObject = (function() {

	var Constructor = function(ctx, x, y, imgs, settings) {
    var defaultSettings = {
      fps: 12,
      startIndex: 0,
      endIndex: imgs.length -1,
			repeat: -1,
			stopAndDie: true,
			animations: {}
		};
		/**
		 * animations: {
		 *   walk: {
		 *     frames: [0,1,2,3,5], // '0..9' // 不能混用; 用陣列寫不然就是字串，不能混用
		 *     fps: 30,             // (optional)可以不寫, 預設 30
		 *     repeat: 1,           // (optional)可以不寫, 預設 1
		 *     stopAndDie: true,    // (optional)可以不寫, 預設 true
		 * 	   duration: 1000       // (optional)可以不寫, 預設 undefined
		 *   }
		 * }
		 */
		Particle.call(this, x, y); // super(x, y, speed, direction, gravity)
		this.ctx = ctx;
    this.imgs = imgs;
		this.settings = utils.deepCopy(settings, defaultSettings);
		this._createAnimations();
		this.currentAnimation = 'default';
    this.currentFrame = 0;
    this.currentRepeat = 0;
    this.isPlaying = false;
    this.totalFrames = this.settings.endIndex - this.settings.startIndex + 1;
		this._init();
  };

	Constructor.prototype = Object.create(Particle.prototype);
  Constructor.prototype.constructor = Constructor;
  
  // observer.js
  Observer(Constructor.prototype);

	Constructor.prototype._init = function() {
    this.img = this.imgs[this.settings.startIndex].img;
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
	
	Constructor.prototype.recover = function () {
		this.alive = true;
	};
	
	Constructor.prototype._createAnimations = function () {
		var animationName;
		var currentAnimationFramesData;
		// set 'default' animation
		this.settings.animations.default = {
			fps: this.settings.fps,
			repeat: this.settings.repeat,
			frames: getDefaultFrames(this.imgs.length),
			stopAndDie: this.settings.stopAndDie,
			duration: (this.settings.duration) ? this.settings.duration : undefined
		};

		// complete all animation
		for (animationName in this.settings.animations) {
			this.settings.animations[animationName].originalFrames = this.settings.animations[animationName].frames;
			currentAnimationFramesData = this._getAnimationFramesData(this.settings.animations[animationName].frames);
			this.settings.animations[animationName].startIndex = currentAnimationFramesData.startIndex;
			this.settings.animations[animationName].endIndex = currentAnimationFramesData.endIndex;
			this.settings.animations[animationName].frames = currentAnimationFramesData.frames;
			this.settings.animations[animationName].totalFrames = currentAnimationFramesData.frames.length;
			if (!this.settings.animations[animationName].hasOwnProperty('repeat')) this.settings.animations[animationName].repeat = 1;
			if (!this.settings.animations[animationName].hasOwnProperty('fps')) this.settings.animations[animationName].fps = 30;
			if (!this.settings.animations[animationName].hasOwnProperty('duration')) this.settings.animations[animationName].duration = undefined;
			if (!this.settings.animations[animationName].hasOwnProperty('stopAndDie')) this.settings.animations[animationName].stopAndDie = true;
		}

		// fn
		function getDefaultFrames(len) {
			var array = [];
			for (var index = 0; index < len; index++) { array.push(index); }
			return array;
		};
	};

	Constructor.prototype._getAnimationFramesData = function (frames) {
		var array = [];
		var i = 0;
		var keyIndex = (frames.constructor === String) ? frames.indexOf('..') : -1;
		var startIndex = 0;
		var endIndex = 0;
		if (frames === undefined) {
			throw new Error('Customized animation frames is required!');
		} else if (frames.constructor === Array) {
			while (i <= frames.length -1 ) {
				if (typeof frames[i] !== 'number') throw new Error('Frames items must be a number!');
				if (frames[i] >= this.imgs.length) throw new Error('Frames items must be smaller than imgs.length');
				i++;
			}
			array = [].concat(frames);
			startIndex = array[0];
			endIndex = array[array.length - 1];
		} else if (keyIndex !== -1) {
			// check 
			startIndex = Number(frames.substring(0, keyIndex));
			endIndex = Number(frames.substring(keyIndex+2));
			if (typeof startIndex !== 'number' || isNaN(startIndex) || startIndex % 1 !== 0 || startIndex < 0 || startIndex >= this.imgs.length) {
				throw new Error('Frames startIndex is wrong!');
			}
			if (typeof endIndex !== 'number' || isNaN(endIndex) || endIndex % 1 !== 0 || endIndex < 0 || endIndex >= this.imgs.length) {
				throw new Error('Frames endIndex is wrong!');
			}
			// set frames array (允許倒序)
			if (startIndex < endIndex) {
				for (var j = startIndex; j <= endIndex; j++) { array.push(j); }
			} else {
				for (var j = startIndex; j >= endIndex; j--) { array.push(j); }
			}
		} else {
			throw new Error('Frames logic is wrong!');
		}
		return {
			frames: array,
			startIndex: startIndex,
			endIndex: endIndex
		};
	};
  
  Constructor.prototype._controlAnimation = function () {
		var currentAnimation = this.settings.animations[this.currentAnimation];
		var key = currentAnimation.frames[this.currentFrame];
		// set currentFrame
		this.img = this.imgs[key].img;
		// next round settings
		this.currentFrame++;

		if (this.currentFrame >= currentAnimation.totalFrames) {
			if (currentAnimation.repeat !== 0 && (this.currentRepeat <= currentAnimation.repeat || currentAnimation.repeat === -1)) {
				this.currentFrame = 0;
				this.currentRepeat++;
			} else {
				this.stop();
				if (currentAnimation.stopAndDie) this.kill();
			}
		}
  };

  Constructor.prototype._controlTimer = function () {
		var currentAnimation = this.settings.animations[this.currentAnimation];
		var speed = 1000 / currentAnimation.fps;
		if (currentAnimation.duration !== undefined) speed = currentAnimation.duration / currentAnimation.totalFrames;
		this.timer = setInterval(this._controlAnimation.bind(this), speed);
  };

  Constructor.prototype.play = function (animationName) {
		if (animationName && this.settings.animations.hasOwnProperty(animationName)) this.currentAnimation = animationName;
		else this.currentAnimation = 'default';
		if (this.isPlaying) clearInterval(this.timer);
		this.trigger('SGObj:animation:play', this.currentAnimation);
		// reset animation data
    this.currentFrame = 0;
    this.currentRepeat = 1;
    this.isPlaying = true;
    this._controlTimer();
    return this;
  };

  Constructor.prototype.resume = function () {
    if (!this.isPlaying) {
      this.isPlaying = true;
			this.trigger('SGObj:animation:resume', this.currentAnimation);
      this._controlTimer();
    }
    return this;
	};

  Constructor.prototype.stop = function () {
    if (this.isPlaying) {
      this.isPlaying = false;
			clearInterval(this.timer);
			this.trigger('SGObj:animation:stop', this.currentAnimation);
    }
    return this;
  };

	return Constructor;
})();