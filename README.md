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

```
// 建立(序列圖檔)遊戲物件
_self.animationItem = new SpriteGameObject(_self.ctx, 500, 220, _self.source['oId'], { fps: 40 });
_self.animationItem.play();
```