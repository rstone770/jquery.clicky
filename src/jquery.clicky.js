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
plugin.version = '<%= version %>';

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