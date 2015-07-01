/**
 * Application defaults.
 * 
 * @type {Object}
 */
var defaults = {

  /**
   * Named mapping between a specific key name and a capture count.
   * 
   * @type {Object<String, Number>}
   */
  captureMap: {
    single: 1,
    double: 2
  },

  /**
   * Capture period increment amount for every capture.
   * 
   * @type {Number}
   */
  capturePeriod: 200,

  /**
   * Invoked on each capture state update. 
   * 
   * @param  {!Object} capture Event click captured count and capture completion flag.
   * @param  {!Object} handlers A collection of handlers keyed to click capture count.
   */
  handler: function (capture, handlers) {
    if (capture.complete) {
      var index = Object.keys(handlers).map(function (i) {
        return parseInt(i);
      }).filter(function (i) {
        return i <= capture.clicks;
      }).sort(function (a, b) {
        return b - a;
      })[0];

      if (handlers[index]) {
        handlers[index].call(this);
      }
    }
  },

  /**
   * Mapping define number of captures that the handler(value) should handle.
   * 
   * @type {Object<Number, Function>}
   */
  handlers: {},

  /**
   * Max number of clicks before captureing is forced to complete.
   * 
   * @type {Number}
   */
  maxCaptures: 2,

  /**
   * Triggers when capture completes.
   * 
   * @param  {!jQuery.Event} e
   */
  onComplete: function () {},

  /**
   * Triggers on capture.
   * 
   * @param  {!jQuery.Event} e [description]
   */
  onCapture: function () {},

  /**
   * Triggers on destroy.
   */
  onDestroy: function () {}
};

module.exports = defaults;