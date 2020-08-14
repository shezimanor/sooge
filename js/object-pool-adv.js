/**
 * Author: Ryan Chen
 * more methods: shuffle / getItem / getRandomAlive / getRandomDead
 */

var ObjectPoolAdv = (function() {

	var Constructor = function() {
		ObjectPool.call(this);
	};

	Constructor.prototype = Object.create(ObjectPool.prototype);
	Constructor.prototype.constructor = Constructor;

	/**
	 * [隨機取得 min ~ max 間的數值(整數)]
	 * @param  {Number} min 
	 * @param  {Number} max 
	 * @return {Number}    
	 */
	var randomInt = function (min, max) {
	  return Math.floor(min + Math.random() * (max - min + 1));
	};

	var shuffleSelf = function (array, size) {
	  var index = -1,
		length = array.length,
		lastIndex = length - 1;
	  size = size === undefined ? length : size;
	  while (++index < size) {
		var rand = randomInt(index, lastIndex);
		var value = array[rand];
		array[rand] = array[index];
		array[index] = value;
	  }
	  array.length = size;
	  return array;
	};

	Constructor.prototype.shuffle = function (idx) {
	  shuffleSelf(this.pool);
	};

	Constructor.prototype.getItem = function(idx) {
		return this.pool[idx]; // gameObject has alive property
	};

	Constructor.prototype.getRandomAlive = function () {
	  var filteredPool = this.pool.filter(function (obj) {
		return obj.alive === true;
	  });
	  var rand = randomInt(0, filteredPool.length - 1);
	  return filteredPool[rand];
	};

	Constructor.prototype.getRandomDead = function () {
	  var filteredPool = this.pool.filter(function (obj) {
		return obj.alive === false;
	  });
	  var rand = randomInt(0, filteredPool.length - 1);
	  return filteredPool[rand];
	};

	return Constructor;
})();
