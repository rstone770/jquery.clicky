jQuery Clicky
=============

A multi-click jQuery plugin.

###Why
jQuery has two types of click events that can be bound to an element, click and dblclick. The issue arises when different behaviors should be assigned for each type of click. For instance, you have a nifty cart system that you want to add in the ability for the user to double click on an item to instantly add it their cart while single clicks should bring up a summary modal.

```JavaScript
	$(...).on('click', function () {
		console.log('display a popover summary of item.');
	}).on('dblclick', function () {
		console.log('add item to cart.');
	});
```

Running this code produces undesired but expected results. When double clicking, the popup summary was triggered twice because double clicking also triggers the click event. The solution is simple. Defer triggering click events for a short capture period. After each click that falls within the capture period, count it and increment the capture length.

_Prior to 0.1.0 the capture strategy just had a set capture period that would record arbitrary amount of captures until the time expired. This would always cause a bit of lag due to having the wait till the capture period expires. With the interval approach the delay in between capture and trigger is much shorter._

###Install
Installing this plugin is pretty much like any other jQuery plugin. The recommended way is just to use bower.

```bash
Bower install jquery.clicky --save
```

You can also simply download a file from the bin folder and link it directly into your project via script tag.

###Usage
There are several ways to use this plugin depending on your requirements. You can use the event driven approach by simply binding events to an element or you can predefine capture handlers.

#####Event Driven

To use the event driven approach simply call clicks over an element.
```JavaScript
$(...).clicky({/* options */});
```
Then start listening to events.
```JavaScript
$(...).on('capture.clicky', function (e, capture) {
	console.log('click!');
}).on('complete.clicky', function (e, capture) {
	console.log('you clicked ' + capture.clicks + ' times.');
});
```
It's as easy as that. Note that you can bind clicky events on elements before you actually initialize clicky. This makes it the preferred method due to the fact that during bundling you do not have to include clicky as a core library and can asyncly load it in.

#####Callback Driven
Predefined callbacks can also be used. To bind these callbacks simply pass in an object of handlers keyed by an integer representing the number of clicks it should handle.
```JavaScript
$(...).clicky({
	handlers: {
		2: function (capture) {
			console.log('you clicked twice!');
		},
		7: function (capture) {
			console.log('wow! you clicked seven times!');
		}
	},
	maxCaptures: 7,
	capturePeriod: 200
});
```
Perhaps an easier way to add handlers is simply using semantic handlers.
```javascript
$(...).clicky({
	single: function () {
		console.log(click!);
	},
	double: function () {
		console.log('click! click!');
	}
});
```

###Initialization
There are several ways that clicky can be initialized. 

####Javascript
Simply call clicky directly on an element and either pass in a set of options or an argument with a handler and or capturePeriod.

```javascript
$(...).clicky({}); // options!
$(...).clicky(function () {...}); // same as $(...).clicky({handler: function () {...}});
$(...).clicky(function () {...}, 500); // same as $(...).clicky({handler: function () {...}, capturePeriod: 500});
```

####Data API
To lazily bind to an element when an element is clicked add a data-clicky attribute. After the binding the click is forwarded as the first capture.

```HTML
<div data-clicky>...</div>
```

To disable the API simply unbind it.
```javascript
$(document).off('.clicky.data-api');
```

####Inline
Clicky provides inline initialization on any element with a data-clicky-inline attribute. Simply add this attribute and on document ready, the plugin will bind itself to that element.

```HTML
<div data-clicky-inline>...</div>
```

###Passing Options
There are several ways that options can be passed into the plugin.

####Defaults
Defaults changes the default state of all new plugins. This is the least specific method of configuration.
```javascript
$.fn.clicky.defaults = {
	/** some defaults */
}
```

####Data attributes
Data attribute configuration allows for inline configuration of the plugin. Because data is not deserialized, only simple configuration string and numerical settings are supported.
```HTML
<div data-clicky data-maxCaptures="350" data-capturePeriod="250">...</div>
```

####Initialization
Passing options during initialization is the most specific configuration method.
```javascript
$(...).clicky({ ... });
```
###Options
Below are a list of supported options and their defaults.

```javascript
$(...).clicky({
	
	/**
	 * Map between an option name and the handler it represents.
	 *
	 * @example
	 * 	$(...).clicky({
	 * 		captureMap: {
	 *			two: 2
	 *		},
	 *		two: function () { ... }
	 * 	});
	 * @type {Object}
	 */
	captureMap: {
	  single: 1,
	  double: 2
	},

	/**
	 * Time period to accept captures after each click before completing.
	 * 
	 * @type {Number}
	 */
	capturePeriod: 200,

	/**
	 * Gets call on each capture. This determines how handlers should be called. By default handlers
	 * are only called when the capture is completed and uses a greedy fall through strategy. 
	 * 
	 * @param  {!Object} capture Event capture event with meta data and last capture event.
	 * @param  {!Object} handlers A collection of handlers keyed to click capture count.
	 */
	handler: function (capture, handlers) { ... },

	/**
	 * Mapping define number of captures that the handler(value) should handle.
	 * 
	 * @example
	 * 	$(...).clicky({
	 *		handlers: {
	 * 			2: function () {
	 * 				console.log('i was clicked twice.');
	 *			}
	 *		}
	 * 	});
	 * @type {Object<Number, Function>}
	 */
	handlers: {},

	/**
	 * Max number of clicks before capturing is forced to complete.
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
});
```

###Events
Clicky provides a several events that be bound to. The advantage to this is that it allows for more than one handler for a specific capture phase.

Event 			| Description
----------------|-------------------------------------------------------------
clicky.destroy 	| Triggers when the elements clicky instance(s) are disposing.
clicky.capture  | Triggers when clicky has received a capture.
clicky.complete | Triggers when clicky has completed a capture cycle.

###Command Api
####$(...).clicky('destroy')
This command will unbind and dispose of all clicky instances attached to that element.
