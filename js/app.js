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