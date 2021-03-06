window.raf = requestAnimationFrame;

var SOOGE = (function () {

  var Constructor = function (settings) {
    this.canvas = settings.canvas;
    this.source = settings.source;
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.canPlay = false;
    this.isTouch = false;
    this.mouse = {
      x: 0,
      y: 0
    };
    // this.init();
  };

  var __utils = {
    min: function (a, b) {
      return a < b ? a : b;
    },
    max: function (a, b) {
      return a > b ? a : b;
    },
    pointInRect2: function (x, y, rect) {
      return utils.inRange(x, rect.left, rect.right) && utils.inRange(y, rect.top, rect.bottom);
    },
    inRange: function (value, min, max) {
      return value >= utils.min(min, max) && value <= utils.max(min, max);
    },
    distanceXY: function (x0, y0, x1, y1) {
      var dx = x1 - x0;
      var dy = y1 - y0;
      return Math.sqrt(dx * dx + dy * dy);
    },
    circlePointCollision: function (x, y, circle_x, circle_y, radius) {
      return utils.distanceXY(x, y, circle_x, circle_y) <= radius;
    }
  };

  // observer.js
  Observer(Constructor.prototype);

  Constructor.prototype.init = function (callback) {
    var _self = this;
    // console.log(this.source);
    var fbData = {
      x: 120,
      y: 140
    }
    // 建立遊戲物件
    _self.fireball = new SpriteGameObject(_self.ctx, fbData.x, fbData.y, _self.source['fireball'], {
      fps: 18,
      repeat: -1,
      stopAndDie: false
    });
    _self.fireball.kill();
    _self.vikings = new SpriteGameObject(_self.ctx, 80, 120, _self.source['vikings'], {
      fps: 18,
      repeat: -1,
      stopAndDie: false, 
      animations: {
        standby: {
          frames: '0..5',
          fps: 5,
          repeat: -1,
          stopAndDie: false
        },
        run: {
          frames: '6..11',
          fps: 30,
          repeat: -1,
          stopAndDie: false
        },
        attack: {
          frames: '12..20',
          fps: 24,
          repeat: 0,
          stopAndDie: false
        },
        walk: {
          frames: '21..34',
          fps: 12,
          repeat: -1,
          stopAndDie: false
        },
      }
    });
    // // 註冊動畫結束事件
    _self.fireball.on('SGObj:animation:play', function (playingAnimation) {
      if (playingAnimation === 'default') {
        _self.fireball.x = fbData.x;
        _self.fireball.y = fbData.y;
        _self.fireball.vx = 1;
      }
    });
    _self.vikings.on('SGObj:animation:play', function (playingAnimation) {
      if (playingAnimation === 'attack') setTimeout(function() {
        _self.fireball.recover();
        _self.fireball.play();
      }, 292); // 1000/24 * (18-12+1) = 291.67
    });
    _self.vikings.on('SGObj:animation:stop', function (playingAnimation) {
      if (playingAnimation === 'attack') _self.vikings.play('standby');
    });
    _self.vikings.play('standby');
    // _self.fireball.play();
    // _self.pikachu = new SpriteGameObject(_self.ctx, 180, 220, _self.source['pikachu'], {
    //   fps: 9,
    //   repeat: -1,
    //   stopAndDie: false
    // });
    // _self.pikachu.play();
    // _self.moveItem = new SpriteGameObject(_self.ctx, 180, 220, _self.source['waterBottle'], {
    //   fps: 16,
    //   repeat: -1,
    //   stopAndDie: false,
    //   animations: {
    //     a1: {
    //       frames: [7,8,9,10,11,12,13,14],
    //       fps: 12,
    //       repeat: -1,
    //       stopAndDie: false
    //     },
    //     a2: {
    //       frames: '0..6',
    //       fps: 18,
    //       repeat: -1,
    //       stopAndDie: false
    //     },
    //     a3: {
    //       frames: '18..0',
    //       fps: 30,
    //       repeat: 2,
    //       stopAndDie: false
    //     }
    //   }
    // });
    // // 註冊動畫結束事件
    // _self.moveItem.on('SGObj:animation:stop', function(stoppedAnimation) {
    //   // 指定的動畫結束後，回去播預設的循環動畫
    //   if (stoppedAnimation === 'a3') _self.moveItem.play();
    // });
    // _self.moveItem.play();
    // _self.moveItem1 = new SpriteGameObject(_self.ctx, 400, 220, _self.source['ADA'], { fps: 24 });
    // _self.moveItem1.play();
    // 遊戲開始
    _self.canPlay = true;
    _self._addMouseEvent();
    _self._loop();
    callback && callback();
  };

  Constructor.prototype._addMouseEvent = function () {
    var _self = this;
    // down
    _self.canvas.addEventListener(utils.Event.down, function (e) {
      e.preventDefault();
      if (!_self.canPlay) return;
      _self.mouse.x = _self.mouse.oldX = utils.coordinate(e).x *= _self._getGameScale();
      _self.mouse.y = _self.mouse.oldY = utils.coordinate(e).y *= _self._getGameScale();
      // open touch mode
      _self.isTouch = true;
      // event down time
      _self.mouse.startTime = performance.now();
    });
    // move
    _self.canvas.addEventListener(utils.Event.move, function (e) {
      e.preventDefault();
      if (!_self.canPlay) return;
      if (!_self.isTouch) return;
      _self.mouse.x = utils.coordinate(e).x *= _self._getGameScale();
      _self.mouse.y = utils.coordinate(e).y *= _self._getGameScale();
      _self.mouse.oldX = _self.mouse.x;
      _self.mouse.oldY = _self.mouse.y;
    });
    // up
    _self.canvas.addEventListener(utils.Event.up, function (e) {
      e.preventDefault();
      if (!_self.canPlay) return;
      // close touch mode
      _self.isTouch = false;
      // Over 4000ms, stop checking pointer's position
      if (performance.now() - _self.mouse.startTime >= 4000) return;
      _self._pointerHandler();
    });
  }

  Constructor.prototype._pointerHandler = function () {
    var _self = this;
    var pointer = {
      x: _self.mouse.x,
      y: _self.mouse.y
    };
  };

  Constructor.prototype._update = function () {
    if (this.fireball.vx > 0) this.fireball.vx += 0.5;
    if (this.fireball.x >= 1000-70.5) {
      this.fireball.vx = 0;
      this.fireball.kill();
    }
    this.fireball.update();
  };

  Constructor.prototype._draw = function () {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.fireball.draw();
    this.vikings.draw();
    // this.moveItem.draw();
    // this.moveItem1.draw();
  };

  Constructor.prototype._loop = function () {
    this._raf = requestAnimationFrame(this._loop.bind(this));
    this._update();
    this._draw();
  };

  Constructor.prototype._getGameScale = function () {
    return this.canvas.width / this.canvas.clientWidth;
  }

  return Constructor;

})();