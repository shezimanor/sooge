/**
 * utils.js
 *
 * Author : Ryan Chen
 * Version: 1.0.0
 * Create : 2020.08.07
 * Update: 2020.08.07
 * License: MIT
 */

var utils = (function(window) {

	var nativeCeil = Math.ceil,
		nativeFloor = Math.floor,
		nativeRandom = Math.random;

	/**
	 * [隨機取得 min ~ max 間的數值(含小數點)]
	 * @param  {Number} min 
	 * @param  {Number} max 
	 * @return {Number}    
	 */
	var randomRange = function(min, max) {
		return min + nativeRandom() * (max - min); 
	};

	/**
	 * [隨機取得 min ~ max 間的數值(整數)]
	 * @param  {Number} min 
	 * @param  {Number} max 
	 * @return {Number}    
	 */
	var randomInt = function(min, max) {
		return nativeFloor(min + nativeRandom() * (max - min + 1)); 
	};

	/**
	 * [預載圖片、影片、音檔、序列圖檔]
	 * @param  {Object} option 請直接使用 snippet preloader2
	 */
	var preloader = function(option) {
		var hasSprite = true; // 用於確認是否有序列圖檔
		var queue = {}; // 儲存載完的檔案
		var settings = {
			manifest: [],
			onEachLoad: function (info) {
				console.log('[Preloader] ' + info.loadIndex + ' loaded');
			},
			onAllLoad: function(queue) { console.log('[Preloader] all completed:' + queue);}
		};

		// 補0
		var stringDigit = function(num, maxNum) {
			var str = num + '';
			var maxLen = (maxNum + '').length;
			var len = str.length;
			var diff = maxLen - len;
			while (diff > 0) {
				str = '0' + str;
				diff--;
			}
			return str;
		};

		var sortQueueArray = function (queue) {
			var key;
			for (key in queue) {
				if (queue[key].constructor === 'Array') {
					queue[key].sort(function(a, b) {
						return a.spriteIndex - b.spriteIndex;
					});
				}
			}
		}

		// option extend settings (淺拷貝)
		var key;
		for (key in settings) {
			if (option[key]) { settings[key] = option[key]; }
		}
		var spriteQty = 0;
		// 如果有序列圖檔的話: allQty != settings.manifest.length
		settings.manifest.forEach(preloadObj => {
			// -1 是因為 settings.manifest.length 已經有算進去一次了
			if (preloadObj.type && preloadObj.type === 'sprite') {
				spriteQty += preloadObj.frames - 1;
				// hasSprite = true
				if (!hasSprite) hasSprite = true;
			}
		});

		var allQty = settings.manifest.length + spriteQty; // 資源數量(未載入)
		var loadedQty = 0; // 已經載入完成的資源數量

		var handleLoadEvent = function(data) {
			settings.onEachLoad(data);
			if (!data.spriteId) {
				queue[data.id] = data;
			} else {
				if (!queue[data.spriteId]) queue[data.spriteId] = [];
				queue[data.spriteId].push(data);
			}
			if (loadedQty === allQty) {
				// 如果有序列圖檔的陣列，先把所有陣列重新排序後再執行 onAllLoad
				if (hasSprite) sortQueueArray(queue);
				settings.onAllLoad(queue);
			}
		}
		
		var onError = function(id) {
			console.error('[Preloader] not found : ' + id);
		}

		var handler = {
			image: function(id, e) {
				loadedQty++;
				var data = {
					id: id,
					loadIndex: loadedQty,
					total: allQty,
					img: this
				};
				handleLoadEvent(data)
			},
			sprite: function (spriteId, index, lastIndex, e) {
				loadedQty++;
				var data = {
					id: spriteId + '_' + stringDigit(index, lastIndex),
					spriteId: spriteId,
					spriteIndex: index,
					loadIndex: loadedQty,
					total: allQty,
					img: this
				};
				handleLoadEvent(data)
			},
			audio: function(id, e) {
				if (e.target.status === 200) {
					loadedQty++;
					var data = {
						id: id,
						loadIndex: loadedQty,
						total: allQty,
						audio: this
					};
					this.src = URL.createObjectURL(e.target.response);
					handleLoadEvent(data)
				} else {
					onError(id);
				}
			},
			video: function(id, e) {
				if (e.target.status === 200) {
					loadedQty++;
					var data = {
						id: id,
						loadIndex: loadedQty,
						total: allQty,
						video: this
					};
					this.src = URL.createObjectURL(e.target.response);
					handleLoadEvent(data)
				} else {
					onError(id);
				}
			}
		};

		for (var i = 0; i < settings.manifest.length; i += 1) {
			var preloadObj = settings.manifest[i];
			if (preloadObj.type === 'audio') {
				var audio = document.createElement('audio');
				var xhr = new XMLHttpRequest();
				xhr.open('GET', preloadObj.src, true);
				xhr.responseType = 'blob';
				xhr.addEventListener('load', handler.audio.bind(audio, preloadObj.id), false);
				xhr.addEventListener('error', onError.bind(audio, preloadObj.id), false);
				xhr.send();
			} else if (preloadObj.type === 'video') {
				var video = document.createElement('video');
				var xhr = new XMLHttpRequest();
				xhr.open('GET', preloadObj.src, true);
				xhr.responseType = 'blob';
				xhr.addEventListener('load', handler.video.bind(video, preloadObj.id), false);
				xhr.addEventListener('error', onError.bind(video, preloadObj.id), false);
				xhr.send();
			} else if (preloadObj.type === 'sprite') {
				var j = 0;
				while (j < preloadObj.frames) {
					var img = document.createElement('img');
					img.addEventListener('load', handler.sprite.bind(img, preloadObj.id, j, preloadObj.frames - 1), false);
					img.addEventListener('error', onError.bind(img, preloadObj.id), false);
					img.src = preloadObj.pathPrepend + stringDigit(j, preloadObj.frames-1) + preloadObj.imgType;
					j++
				}
			} else {
				var img = document.createElement('img');
				img.addEventListener('load', handler.image.bind(img, preloadObj.id), false);
				img.addEventListener('error', onError.bind(img, preloadObj.id), false);
				img.src = preloadObj.src;
			} 
		}
	};

	var userAgent = navigator.userAgent || navigator.vendor || window.opera;
	
	/**
	 * [判斷是否為行動裝置]
	 */
	var isMobile = userAgent.match(/iPhone/i) || userAgent.match(/iPod/i) || userAgent.match(/iPad/i) || userAgent.match(/Android/i) ? true : false;
	
	var isiOS = userAgent.match(/iPhone/i) || userAgent.match(/iPod/i) || userAgent.match(/iPad/i) ? true : false;

	var isAndroid = userAgent.match(/Android/i) ? true : false;

	/**
	 * [判斷是否為line 或是 fb]
	 * @type {Boolean}
	 */
	var isInapp = userAgent.toLowerCase().match(/fb/i) || userAgent.toLowerCase().match(/line/i);

	/**
	 * [判斷是否為line]
	 * @type {Boolean}
	 */
	var isLineInapp = userAgent.toLowerCase().match(/line/i);

	/**
	 * [判斷是否為fb]
	 * @type {Boolean}
	 */
	var isFbInapp = userAgent.toLowerCase().match(/fb/i);

	/**
	 * [行動裝置的 touch 事件字串，若不是行動裝置，取得 mouse 事件字串]
	 */
	var Event = (function () {
		if (isMobile) {
			return {
				down : 'touchstart',
				move : 'touchmove',
				up : 'touchend'
			}
		} else {
			return {
				down: 'mousedown',
				move: 'mousemove',
				up: 'mouseup'
			};
		};
	})();

	/**
	 * [深拷貝]
	 * @param  {Object} p 父物件
	 * @param  {Object} c 子物件
	 */
	var deepCopy = function(p, c) {
		var c = c || {};
		for (var i in p) {
			if (typeof p[i] === 'object') {
				// 如果 property 是物件或陣列
				c[i] = (p[i].constructor === Array) ? [] : {};
				deepCopy(p[i], c[i]);
			} else {
				// 淺拷貝
				c[i] = p[i];
			}
		}
		return c;
	};

	/**
	 * [取得滑鼠座標]
	 */
	var coordinate = function(e) {
		var rect = e.target.getBoundingClientRect();
		var clientX = e.clientX;
		var clientY = e.clientY;
		if (e.touches) {
			clientX = e.touches[0].clientX;
			clientY = e.touches[0].clientY;
		};
		var xCoor = clientX - rect.left;
		var yCoor = clientY - rect.top;
		return {
			x: xCoor,
			y: yCoor
		};
	};

	return {
		preloader: preloader,
		randomRange: randomRange,
		randomInt: randomInt,
		isMobile: isMobile,
		isiOS: isiOS,
		isAndroid: isAndroid,
		isInapp: isInapp,
		isFbInapp: isFbInapp,
		isLineInapp: isLineInapp,
		Event: Event,
		deepCopy: deepCopy,
		coordinate: coordinate
	};

})(window);