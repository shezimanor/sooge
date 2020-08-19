const obj = {
	name: 'George',
	walk() {
	  this.trigger('walk', 'let me go');
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
obj.on('walk', function (txt) {
  console.log(txt);
});
obj.walk();


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
	}
  ],
  onEachLoad: function () {},
  onAllLoad: function (source) {
    // do something
    console.log('source:', source);
  }
});


// sprite-game-object
var spriteGameObject = new SpriteGameObject(_self.ctx, 500, 220, _self.source['waterBottle'], {
	fps: 16,
	repeat: 1,
	stopAndDie: true,
	animations: {
		animation3: {
			frames: [1, 3, 5, 7], // 使用陣列插值，值僅接受正整數
			fps: 12,
			repeat: 1
		},
		animation2: {
			frames: '0..8', // 如果是連續的，允許使用字串描述
			fps: 18,
			repeat: 1
		},
		animation3: {
			frames: '12..4', // 允許倒序
			fps: 18,
			repeat: 1
		}
	}
});

// sprite-game-object:應用
spriteGameObject.on('SGObj:animation:stop', function(stoppedAnimation) {
	// 指定的動畫結束後，回去播預設的循環動畫
	if (stoppedAnimation === 'animation3') spriteGameObject.play();
});