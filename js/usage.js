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