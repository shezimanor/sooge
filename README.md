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
        pathPrepend: './images/seq/water_000',
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