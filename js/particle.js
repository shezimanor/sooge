/**
 * Author: Ryan Chen
 * Reference: Hank Hsiao / Coding Math
 */
var Particle = (function() {

	var Constructor = function(x, y, speed, direction, gravity) {
		this.x = x || 0,  // x 座標
		this.y = y || 0,  // y 座標
		this.vx = Math.cos(direction || 0) * speed || 0, // x 方向的速度
		this.vy = Math.sin(direction || 0) * speed || 0, // y 方向的速度
		this.mass =  1, // 質量 (跟 gravitation 有關，不是 gravity)
		this.radius =  0, // 半徑
		this.bounce =  -1, // 回彈
		this.friction =  1, // 摩擦力
		this.gravity = gravity || 0, // 地心引力 (y 方向的加速度)
		this.springs =  [], //儲存所有 spring (spring 是 paritcle 跟 particle 的彈簧)
		this.gravitations =  [] //儲存所有 gravitation (gravitation 是 paritcle 跟 particle 的引力，跟 gravity 不同)
	};

	Constructor.prototype.addGravitation = function(point) {
		this.removeGravitation(point); // remove 是因為要判斷刪除重覆的關連 (a -> b, b -> a)
		this.gravitations.push(point);
	};

	Constructor.prototype.removeGravitation = function(point) {
		for (var i = this.gravitations.length - 1; i >= 0; i--) {
			if (point === this.gravitations[i].point) {
				this.gravitations.splice(i, 1);
				return;
			}
		}
	};

	Constructor.prototype.addSpring = function(point, k, length) {
		this.removeSpring(point); // remove 是因為要判斷刪除重覆的關連 (a -> b, b -> a)
		this.springs.push({
			point: point,
			k: k,
			length: length || 0
		});
	};

	Constructor.prototype.removeSpring = function(point) {
		for (var i = this.springs.length - 1; i >= 0; i--) {
			if (point === this.springs[i].point) {
				this.springs.splice(i, 1);
				return;
			}
		}
	};

	Constructor.prototype.getSpeed = function() {
		return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
	};

	Constructor.prototype.setSpeed = function(speed) {
		var heading = this.getHeading();
		this.vx = Math.cos(heading) * speed;
		this.vy = Math.sin(heading) * speed;
	};

	Constructor.prototype.getHeading = function() {
		return Math.atan2(this.vy, this.vx);
	};

	Constructor.prototype.setHeading = function(heading) {
		var speed = this.getSpeed();
		this.vx = Math.cos(heading) * speed;
		this.vy = Math.sin(heading) * speed;
	};

	Constructor.prototype.accelerate = function(ax, ay) {
		this.vx += ax;
		this.vy += ay;
	};

	Constructor.prototype.update = function() {
		// this.handleSprings();
		// this.handleGravitation();
		this.vx *= this.friction;
		this.vy *= this.friction;
		this.vy += this.gravity;
		this.x += this.vx;
		this.y += this.vy;
	};

	Constructor.prototype.handleSprings = function() {
		for (var i = this.springs.length - 1; i >= 0; i--) {
			var spring = this.springs[i];
			this.springTo(spring.point, spring.k, spring.length);
		}
	};

	Constructor.prototype.handleGravitation = function() {
		for (var i = this.gravitations.length - 1; i >= 0; i--) {
			this.gravitateTo(this.gravitations[i]);
		}
	};

	Constructor.prototype.angleTo = function(p2) {
		return Math.atan2(p2.y - this.y, p2.x - this.x);
	};

	Constructor.prototype.distanceTo = function(p2) {
		var dx = p2.x - this.x;
		var dy = p2.y - this.y;
		return Math.sqrt(dx * dx + dy * dy);
	};

	Constructor.prototype.gravitateTo = function(p2) {
		// 重力加速度: F = (G * M) / (r * r)
		var dx = p2.x - this.x;
		var dy = p2.y - this.y;
		var distSQ = dx * dx + dy * dy;
		var dist = Math.sqrt(distSQ);
		var force = p2.mass / distSQ;
		var angle = this.angleTo(p2);
		// var ax =  Math.cos(angle) * force;
		// var ay =  Math.sin(angle) * force;
		// 上面這兩行等同於下面這兩行 (Math.cos(θ) = dx / distance)
		var ax =  dx / dist * force;
		var ay =  dy / dist * force;
		this.vx += ax;
		this.vy += ay;
	};

	Constructor.prototype.springTo = function(point, k, length) {
		// 彈簧公式：F = -kx (這邊是用 F = kx)            
		var dx = point.x - this.x;
		var dy = point.y - this.y;
		var distance = Math.sqrt(dx * dx + dy * dy);
		var springForce = (distance - (length || 0)) * k;
		// Math.cos(θ) = dx / distance
		this.vx += dx / distance * springForce;
		this.vy += dy / distance * springForce;
	};

	return Constructor;
})();