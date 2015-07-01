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
  this._trigger(this.$el, 'destroy.clicky');
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
Clicky.prototype._capture = function (e) {
  var self = this;

  this._clicks++;

  this._dispatch(e, false);

  if (typeof this._timeoutId === 'number') {
    clearTimeout(this._timeoutId);
  }

  this._timeoutId = setTimeout(function () {
    self._completeCapture(e);
  }, this.options.capturePeriod);
};

/**
* Completes and unbinds capturing.
*
* @param {jQuery.Event} e
*/
Clicky.prototype._completeCapture = function (e) {
  clearTimeout(this._timeoutId);

  this._dispatch(e, true);
  this._reset();
};

/**
 * Invokes handler with current application state and dispatches matching events.
 *
 * @param {!jQuery.Event} e
 * @param {!Boolean} complete
 */
Clicky.prototype._dispatch = function (e, complete) {
  var name = complete ? 'complete.clicky' : 'capture.clicky', 
      capture = {
        clicks: this._clicks,
        complete: complete,
        event: e
      };

  this._trigger(e.target, name, capture);

  this.options.handler.call(this.$el, capture, this.options.handlers);
};

/**
 * Element click handler that dispatches state update.
 *
 * @param {!jQuery.Event} e
 */
Clicky.prototype._handleClick = function (e) {
  this._capture(e);

  if (this._clicks >= this.options.maxCaptures) {
    this._completeCapture(e);
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
 * @param {!jQuery.Element} on
 * @param {!String} trigger
 * @param {?Object} capture
 */
Clicky.prototype._trigger = function (on, event, capture) {
  var method = 'on' + event.split('.')[0].toUpperCase(),
      $this = this.$el;

  if ($.isFunction(this.options[method])) {
    method.apply($this, slice.call(arguments, 1));
  }

  $(on).trigger(new $.Event(event, capture));
};

module.exports = Clicky;