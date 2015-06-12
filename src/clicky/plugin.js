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