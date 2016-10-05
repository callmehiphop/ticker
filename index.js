'use strict';

var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;
var now = require('performance-now');
var raf = require('raf');

/**
 * Creates a new ticker. The ticker will auto-magically start once it detects
 * an event listener of some kind (update/render).
 *
 * @inherits EventEmitter
 *
 * @param {object} el - HTML canvas element to be passed to raf.
 * @param {number=} fps - Desired frames per second, defaults to 60.
 */
function Ticker(el, fps) {
  if (!(this instanceof Ticker)) {
    return new Ticker(el, fps);
  }

  this._handle = null;
  this._previous = null;
  this._lag = 0;
  this._frameSpeed = 1000 / (fps || 60);
  this.el = el;

  EventEmitter.call(this);

  var self = this;

  this.once('newListener', function() {
    self.resume();
  });
}

inherits(Ticker, EventEmitter);

/**
 * Gets/sets appropriate timestamps and fires events to let the user know
 * if they should be updating/rendering their models.
 *
 * @fires Ticker#update
 * @fires Ticker#render
 */
Ticker.prototype.tick = function() {
  var current = now();
  var elapsed = current - this._previous;
  var render = false;

  this._prevous = current;
  this._lag += elapsed;

  while (this._lag >= this._frameSpeed) {
    this.emit('update', elapsed);
    this._lag -= this._frameSpeed;
    render = true;
  }

  if (render) {
    this.emit('render', this._lag / this._frameSpeed);
  }

  this._handle = raf(this.tick.bind(this), this.el);
};

/**
 * Stops the ticker.
 */
Ticker.prototype.stop = function() {
  raf.cancel(this._handle);
};

/**
 * Resumes the ticker where it left off.
 */
Ticker.prototype.resume = function() {
  this._previous = now();
  this._handle = raf(this.tick.bind(this), this.el);
};

module.exports = Ticker;
