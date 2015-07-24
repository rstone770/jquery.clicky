/**!
 * jquery.clicky v0.1.1
 * http://www.github.com/rstone770/jquery.clicky
 *
 * Copyright 2015 Brenden Snyder
 * Released under the MIT license
 */
!function t(i,e,c){function n(r,a){if(!e[r]){if(!i[r]){var s="function"==typeof require&&require;if(!a&&s)return s(r,!0);if(o)return o(r,!0);var l=new Error("Cannot find module '"+r+"'");throw l.code="MODULE_NOT_FOUND",l}var u=e[r]={exports:{}};i[r][0].call(u.exports,function(t){var e=i[r][1][t];return n(e?e:t)},u,u.exports,t,i,e,c)}return e[r].exports}for(var o="function"==typeof require&&require,r=0;r<c.length;r++)n(c[r]);return n}({1:[function(t,i,e){var c=t("./defaults"),n=[].slice,o=function(t,i){this.$el=$(t),this.options=o._mapOptions(i),this._onClick=this._handleClick.bind(this),this._timeoutId=null,this._clicks=0,this._bind(),this._reset()};o._mapOptions=function(t){var i=$.extend({},c);for(var e in t)i.hasOwnProperty(e)&&(i[e]=t[e]);if(i.captureMap)for(var n in i.captureMap)t.hasOwnProperty(n)&&(i.handlers[n]=t);return i},o.prototype.destroy=function(){clearTimeout(this._timeoutId),this.$el.off("click.clicky",this._onClick),this._trigger(this.$el,"destroy.clicky")},o.prototype._bind=function(){this.$el.on("click.clicky",this._onClick)},o.prototype._capture=function(t){var i=this;this._clicks++,this._dispatch(t,!1),"number"==typeof this._timeoutId&&clearTimeout(this._timeoutId),this._timeoutId=setTimeout(function(){i._completeCapture(t)},this.options.capturePeriod)},o.prototype._completeCapture=function(t){clearTimeout(this._timeoutId),this._dispatch(t,!0),this._reset()},o.prototype._dispatch=function(t,i){var e=i?"complete.clicky":"capture.clicky",c={clicks:this._clicks,complete:i,event:t};this._trigger(t.target,e,c),this.options.handler.call(this.$el,c,this.options.handlers)},o.prototype._handleClick=function(t){this._capture(t),this._clicks>=this.options.maxCaptures&&this._completeCapture(t)},o.prototype._reset=function(){this._clicks=0,this._timeoutId=null},o.prototype._trigger=function(t,i,e){var c="on"+i.split(".")[0].toUpperCase(),o=this.$el;$.isFunction(this.options[c])&&c.apply(o,n.call(arguments,1)),$(t).trigger(new $.Event(i,e))},i.exports=o},{"./defaults":2}],2:[function(t,i,e){var c={captureMap:{single:1,"double":2},capturePeriod:200,handler:function(t,i){if(t.complete){var e=Object.keys(i).map(function(t){return parseInt(t)}).filter(function(i){return i<=t.clicks}).sort(function(t,i){return i-t})[0];i[e]&&i[e].call(this)}},handlers:{},maxCaptures:2,onComplete:function(){},onCapture:function(){},onDestroy:function(){}};i.exports=c},{}],3:[function(t,i,e){var c=t("./clicky"),n=function(t,i){var e=t.data("clickys")||[];e.push(new c(t,i)),t.on("destroy.clicky",function(){t.off(".clicky").data("clicky",null)}),t.data("clicky",e)},o=function(t,i){var e=t.data("clickys")||[];$.each(e,function(t,e){"function"==typeof e[i]&&e[i]()})},r=function(t,i){var e={};return $.isPlainObject(t)?$.extend(e,t):$.isFunction(t)&&$.extend(e,{capturePeriod:i,handler:t}),$(this).each(function(){var i=$(this);"string"==typeof t?o(i,t):n(i,$.extend({},i.data(),e))})};i.exports=r},{"./clicky":1}],4:[function(t,i,e){var c=t("./clicky/defaults"),n=t("./clicky/plugin"),o=$.fn.clicky;n.defaults=c,n.version="0.1.1",n.noConflict=function(){return $.fn.clicky=o,n},$.fn.clicky=n,$(function(){$("[data-clicky-inline]").clicky()}),$(document).on("click.clicky.data-api","[data-clicky]",function(t){var i=$(this),e=$(this).data("clicky.data-api");e||i.clicky().trigger("click.clicky",t).data("clicky.data-api",!0)})},{"./clicky/defaults":2,"./clicky/plugin":3}]},{},[4]);