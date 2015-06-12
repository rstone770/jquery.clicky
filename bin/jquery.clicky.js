/**!
 * jquery.clicky v0.0.1
 * http://www.github.com/rstone770/jquery.clicky
 *
 * Copyright 2015 Brenden Snyder
 * Released under the MIT license
 */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var defaults = require('./defaults');

/**
 * Short hand array slice.
 * 
 * @type {Function}
 */
var slice = [].slice;

/**
 * Clicky application
 * 
 * @param {!jQuery.Element} $el
 * @param {!Object} options
 */
var Clicky = function ($el, options) {
  this.$el = $($el);
  this.options = Clicky._mapOptions(options);

  this._onClick = this._handleClick.bind(this);
  this._timeoutId = null;
  this._clicks = 0;

  this._bind();
  this._reset();
};

/**
 * Maps user options with defaults.
 * 
 * @param  {!Object} options
 * @return {!Object}
 */
Clicky._mapOptions = function (options) {
  var result = $.extend({}, defaults);

  for (var option in options) {
    if (result.hasOwnProperty(option)) {
      result[option] = options[option];
    }
  }

  if (result.captureMap) {
    for (var key in result.captureMap) {
      if (options.hasOwnProperty(key)) {
        result.handlers[key] = options;
      }
    }
  }

  return result;
};

/**
 * Unbinds application and disposes.
 */
Clicky.prototype.destroy = function () {
  clearTimeout(this._timeoutId);

  this.$el.off('click.clicky', this._onClick);
  this._trigger('destroy.clicky');
};

/**
 * Binds application to element.
 */
Clicky.prototype._bind = function () {
  this.$el.on('click.clicky', this._onClick);
};

/**
 * Creates/update capture state.
 * 
 * @param  {!jQuery.Event} e
 */
Clicky.prototype._capture = function () {
  this._clicks++;

  this._dispath(false);

  if (this._clicks === 1) {
    this._timeoutId = setTimeout(this._completeCapture.bind(this), this.options.capturePeriod);
  }
};

/**
* Completes and unbinds capturing.
*/
Clicky.prototype._completeCapture = function () {
  clearTimeout(this._timeoutId);

  this._dispath(true);
  this._reset();
};

/**
 * Invokes handler with current application state and dispatches matching events.
 *
 * @param {!Boolean} complete
 */
Clicky.prototype._dispath = function (complete) {
  var name = complete ? 'complete.clicky' : 'capture.clicky', 
      capture = {
        clicks: this._clicks,
        complete: complete
      };

  this._trigger(name, capture);

  this.options.handler.call(this.$el, capture, this.options.handlers);
};

/**
 * Element click handler that dispatches state update.
 */
Clicky.prototype._handleClick = function () {
  this._capture();

  if (this._clicks >= this.options.maxCaptures) {
    this._completeCapture();
  }
};

/**
 * Resets internal counts and handles.
 */
Clicky.prototype._reset = function () {
  this._clicks = 0;
  this._timeoutId = null;
};

/**
 * Triggers an event on the application element while also triggering its 'on' counterpart. 
 *
 * @example
 *   _trigger('meow.click', ...) => onMeow(...)
 * 
 * @param {!String} trigger
 * @param {?Object} capture
 */
Clicky.prototype._trigger = function (event, capture) {
  var method = 'on' + event.split('.')[0].toUpperCase(),
      $this = this.$el;

  if ($.isFunction(this.options[method])) {
    method.apply($this, slice.call(arguments, 1));
  }

  $this.trigger(new $.Event(event, capture));
};

module.exports = Clicky;
},{"./defaults":2}],2:[function(require,module,exports){
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
   * Time period to accept captures before completing.
   * 
   * @type {Number}
   */
  capturePeriod: 250,

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
},{}],3:[function(require,module,exports){
var Clicky = require('./clicky');

/**
 * Creates and binds a new clicky to an element.
 * 
 * @param  {!jQuery.Element} $el
 * @param  {!Object} options [description]
 */
var createClicky = function ($el, options) {
  var clickys = $el.data('clickys') || [];

  clickys.push(new Clicky($el, options));

  $el.on('destroy.clicky', function () {
    $el.off('.clicky').data('clicky', null);
  });

  $el.data('clicky', clickys);
};

/**
 * Process clicky command attached to an element.
 * 
 * @param  {!jQuery.Element} $el
 * @param  {!String} command
 */
var processClicky = function ($el, command) {
  var clickys = $el.data('clickys') || [];

  $.each(clickys, function (index, clicky) {
    if (typeof clicky[command] === 'function') {
      clicky[command]();
    }
  });
};

/**
 * Clicky entry point.
 * 
 * @param  {!(Object | Function)} handler Click handler or a group of options to configure clicky.
 * @param  {Number=} capturePeriod
 * @return {!jQuery.Element}
 */
var plugin = function (handler, capturePeriod) {
  var options = {};

  if ($.isPlainObject(handler)) {
    $.extend(options, handler);
  } else if ($.isFunction(handler)) {
    $.extend(options, {
      capturePeriod: capturePeriod,
      handler: handler
    });
  }

  return $(this).each(function () {
    var $this = $(this);

    if (typeof handler === 'string') {
      processClicky($this, handler);
    } else {
      createClicky($this, $.extend({}, $this.data(), options));
    }
  });
};

module.exports = plugin;
},{"./clicky":1}],4:[function(require,module,exports){
;(function ($) {
  'use strict';

  var defaults = require('./clicky/defaults'),
      plugin = require('./clicky/plugin');

  /**
   * Old instance of clicky plugin.
   * 
   * @type {Function}
   */
  var previous = $.fn.clicky;

  /**
   * Plugin defaults.
   *
   * @type {Object}
   */
  plugin.defaults = defaults;

  /**
   * Plugin version.
   * 
   * @type {String}
   */
  plugin.version = '0.0.1';

  /**
   * Restores previous clicky plugin and returns this plugins entry point.
   * 
   * @return {!Function}
   */
  plugin.noConflict = function () {
    $.fn.clicky = previous;

    return plugin;
  };

  /**
   * Exports
   */
  $.fn.clicky = plugin;

  /**
   * Inline initialization
   */
  $(function () {
    $('[data-clicky-inline]').clicky();
  });

  /**
   * Data api.
   *
   * Lazily bind to an element once then forwards the first click event as a capture.
   */
  $(document).on('click.clicky.data-api', '[data-clicky]', function (e) {
    var $this = $(this),
        bound = $(this).data('clicky.data-api');

    if (!bound) {
      $this
        .clicky()
        .trigger('click.clicky', e)
        .data('clicky.data-api', true);
    }
  });

}) (jQuery);
},{"./clicky/defaults":2,"./clicky/plugin":3}]},{},[4]);
