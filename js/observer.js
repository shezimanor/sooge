// observer.js
// Observer(Constructor.prototype);
var Observer = function(obj) {
  var ObsObj = function() {};
  // 只有 ObsObj 為函數時，prototype 才有東西，一般物件不會有
  // console.log(ObsObj.prototype);
  // 其實有兩種寫法，看是要把所有的方法放在ObsObj.prototype底下 還是ObsObj底下
  // 1. ObsObj = function() {}; => ObsObj.prototype (.methods)
  // 2. ObsObj = {}; => ObsObj (.methods)
  /**
   * [混合物件]
   * @param  {Object} obj 物件
   */
  var mixin = function(obj) {
    for (var key in ObsObj.prototype) {
      obj[key] = ObsObj.prototype[key];
    }
    return obj;
  };

  ObsObj.prototype.on =
    ObsObj.prototype.addEventListener = function (event, fn) {
      this._callbacks = this._callbacks || {};
      (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
      .push(fn);
      return this;
    };

  ObsObj.prototype.once = function (event, fn) {
    function on() {
      this.off(event, on);
      fn.apply(this, arguments);
    };
    on.fn = fn;
    this.on(event, on);
    return this;
  };

  ObsObj.prototype.off =
    ObsObj.prototype.removeEventListener = function (event, fn) {
      this._callbacks = this._callbacks || {};

      // all
      if (0 == arguments.length) {
        this._callbacks = {};
        return this;
      };

      // specific event
      var callbacks = this._callbacks['$' + event];
      if (!callbacks) return this;

      // remove all handlers
      if (1 == arguments.length) {
        delete this._callbacks['$' + event];
        return this;
      };

      // remove specific handler
      var cb;
      for (var i = 0; i < callbacks.length; i++) {
        cb = callbacks[i];
        if (cb === fn || cb.fn === fn) {
          callbacks.splice(i, 1);
          break;
        };
      };

      // Remove event specific arrays for event types that no
      // one is subscribed for to avoid memory leak.
      if (callbacks.length === 0) {
        delete this._callbacks['$' + event];
      };

      return this;
    };

  ObsObj.prototype.trigger = function (event) {
    this._callbacks = this._callbacks || {};
    var args = [].slice.call(arguments, 1),
      callbacks = this._callbacks['$' + event];

    if (callbacks) {
      callbacks = callbacks.slice(0);
      for (var i = 0, len = callbacks.length; i < len; ++i) {
        callbacks[i].apply(this, args);
      };
    };

    return this;
  };

  ObsObj.prototype.listeners = function (event) {
    this._callbacks = this._callbacks || {};
    return this._callbacks['$' + event] || [];
  };

  ObsObj.prototype.hasListeners = function (event) {
    return !!this.listeners(event).length;
  };

  return mixin(obj);
};

