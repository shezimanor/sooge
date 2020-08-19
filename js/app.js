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
			document.getElementById('play1').addEventListener('click', function (e) {
				game.moveItem.play('a1');
			});

			document.getElementById('play2').addEventListener('click', function (e) {
				game.moveItem.play('a2');
			});

			document.getElementById('play3').addEventListener('click', function (e) {
				game.moveItem.play('a3');
			});
		})
		
  }
});