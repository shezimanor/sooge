# Simple Object-oriented Gaming Engines

簡易的物件導向引擎，將自己過往常使用的工具標準化。

渲染 `canvas` 作為基底的標準化工具。

## observer.js

### observer usage:

```
Observer(obj);
```

## utils.js

### preloader usage:

```
utils.preloader({
  manifest: [
    {
        id: 'waterBottle',
        type: 'sprite',
        pathPrepend: './images/seq/water_000', // 最後是檔名的開頭(不包含所有index的位數)
        imgType: '.png',
        frames: 21
    },
    {id: 'desk', src: './images/desk.png'}
  ],
  onEachLoad: function() {},
  onAllLoad: function(source) {
    // do something
    console.log('source:', source);
  }
})
```

## sprite-game-object.js & sooge.js

基本設定:
```
// 建立(序列圖檔)遊戲物件(最簡單的設定)
_self.animationItem = new SpriteGameObject(_self.ctx, 500, 220, _self.source['oId'], { fps: 40 });
_self.animationItem.play();
```

動畫物件:
```
// animations:
animations: {
  walk: {
    frames: [0,1,2,3,5], // '0..9' // 不能混用; 用陣列寫不然就是字串，不能混用
    fps: 30,             // (optional)可以不寫, 預設 30
    repeat: 1,           // (optional)可以不寫, 預設 1
    stopAndDie: true,    // (optional)可以不寫, 預設 true
    duration: 1000       // (optional)可以不寫, 預設 undefined
  }
}
```
有指定動畫的設定:
```
// 建立(序列圖檔)遊戲物件(可指定動畫[陣列or字串])
_self.animationItem = new SpriteGameObject(_self.ctx, 180, 220, _self.source['oId'], {
  fps: 16,
  repeat: -1,
  stopAndDie: false,
  animations: {
    a1: {
      frames: [7,8,9,10,11,12,13,14],
      fps: 12,
      repeat: -1,
      stopAndDie: false
    },
    a2: {
      frames: '0..6',
      fps: 18,
      repeat: -1,
      stopAndDie: false
    },
    a3: {
      frames: '18..0',
      fps: 30,
      repeat: 2,
      stopAndDie: false
    }
  }
});

// 註冊動畫結束事件
_self.animationItem.on('SGObj:animation:stop', function(stoppedAnimation) {
  // 指定的動畫結束後，回去播預設的循環動畫
  if (stoppedAnimation === 'a3') _self.animationItem.play();
});

// 播放指定的動畫'a3'
_self.animationItem.play('a3');

// 播放預設的動畫(0 --> 最後)
_self.animationItem.play();
```