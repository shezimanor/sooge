/**
 * Author: Ryan Chen
 * Reference: Hank Hsiao
 */

var ObjectPool = (function() {

	var Constructor = function() {
		this.pool = [];
	};

	Constructor.prototype.add = function(gameObject) {
		this.pool.push(gameObject); // gameObject has alive property
	};

	Constructor.prototype.getFirstAlive = function() {
		return this.pool.filter(function(obj) {
			return obj.alive === true;
		})[0];
	};

	Constructor.prototype.getFirstDead = function() {
		return this.pool.filter(function(obj) {
			return obj.alive === false;
		})[0];
	};

	Constructor.prototype.forEach = function (callback, thisArg) {
		for (var i = 0, len = this.pool.length; i < len; i++) {
			callback.call(thisArg, this.pool[i], i, this.pool);
		}
	};

	Constructor.prototype.forEachAlive = function(callback, thisArg) {
		for (var i = 0, len = this.pool.length; i < len; i++) {
			if (this.pool[i].alive === true) {
				callback.call(thisArg, this.pool[i], i, this.pool);
			}
		}
	};

	Constructor.prototype.forEachDead = function(callback, thisArg) {
		for (var i = 0, len = this.pool.length; i < len; i++) {
			if (this.pool[i].alive === false) {
				callback.call(thisArg, this.pool[i], i, this.pool);
			}
		}
	};

	Constructor.prototype.size = function() {
		return this.pool.length;
	};

	Constructor.prototype.clear = function() {
		return this.pool.length = 0;
	};

	return Constructor;
})();
