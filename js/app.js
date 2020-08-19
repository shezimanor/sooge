const obj = {
	name: 'George',
	click() {
	  this.trigger('go', 'let him go');
	},
	sing() {
		return `lalala ${this.name}`;
	},
	singAgain() {
		return `${this.sing()}!`;
	}
}


// Observer
Observer(obj);
obj.on('go',function (txt) {
  console.log(txt);
});
obj.click();


// utils
utils.preloader({
  manifest: [{
	  id: 'waterBottle',
	  type: 'sprite',
	  pathPrepend: './images/w/water_000',
	  imgType: '.png',
	  frames: 21
	},
	{
		id: 'ADA',
		type: 'sprite',
		pathPrepend: './images/ADA/ADA_000',
		imgType: '.png',
		frames: 16
	},
	{
		id: 'fireball',
		type: 'sprite',
		pathPrepend: './images/fireball/fireball_',
		imgType: '.png',
		frames: 18
	},
	{
		id: 'vikings',
		type: 'sprite',
		pathPrepend: './images/vikings/vikings_',
		imgType: '.png',
		frames: 35
	},
	// {
	// 	id: 'pikachu',
	// 	type: 'sprite',
	// 	pathPrepend: './images/pikachu/pikachu_00',
	// 	imgType: '.png',
	// 	frames: 3
	// },
	{
	  id: 'desk',
	  src: './images/desk.png'
	}],
  onEachLoad: function () {},
  onAllLoad: function (source) {
		// do something
		// console.log('source:', source);
		var game = new SOOGE({
			source: source,
			canvas: document.getElementById('gameCanvas')
		});
		game.init(function() {
			// 攻擊
			document.getElementById('attack').addEventListener('click', function (e) {
				game.vikings.play('attack');
				document.getElementById('walk').textContent = 'Walk';
				document.getElementById('run').textContent = 'Run';
			});

			// 走路切換
			document.getElementById('walk').addEventListener('click', function (e) {
				if (game.vikings.currentAnimation === 'walk') {
					game.vikings.play('standby');
					document.getElementById('walk').textContent = 'Walk';
				} else {
					game.vikings.play('walk');
					document.getElementById('walk').textContent = 'Stop';
				}
			});

			document.getElementById('run').addEventListener('click', function (e) {
				if (game.vikings.currentAnimation === 'run') {
					game.vikings.play('standby');
					document.getElementById('run').textContent = 'Run';
				} else {
					game.vikings.play('run');
					document.getElementById('run').textContent = 'Stop';
				}
			});
		})
		
  }
});