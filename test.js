'use strict';

var assert = require('assert');
var now = require('performance-now');
var Ticker = require('./');

describe('Ticker', function() {
  var noop = function() {};
  var ticker;

  beforeEach(function() {
    ticker = new Ticker();
  });

  describe('constructor()', function() {
    it('should localize the ticker element', function() {
      var el = {};
      var ticker = new Ticker(el);

      assert.strictEqual(ticker.el, el);
    });

    it('should transform the fps into frame speed', function() {
      var fps = 30;
      var expectedFrameSpeed = 1000 / 30;
      var ticker = new Ticker(null, fps);

      assert.strictEqual(ticker._frameSpeed, expectedFrameSpeed);
    });

    it('should default to 60 fps', function() {
      var expectedFrameSpeed = 1000 / 60;

      assert.strictEqual(ticker._frameSpeed, expectedFrameSpeed);
    });

    it('should not start ticking until a listener is found', function() {
      var called = false;

      ticker.resume = function() {
        called = true;
      };

      assert.strictEqual(called, false);
      ticker.on('update', noop);
      assert.strictEqual(called, true);
    });
  });

  describe('tick()', function() {
    it('should emit an update event', function(done) {
      var time = now();
      var previous;

      ticker.on('update', function(elapsed) {
        ticker.stop();

        var current = ticker._prevous;

        assert(current > time);
        assert.strictEqual(elapsed, current - previous);

        done();
      });

      previous = ticker._previous;
    });

    it('should emit the render event', function(done) {
      ticker.on('render', function(frame) {
        ticker.stop();

        assert.strictEqual(frame, ticker._lag / ticker._frameSpeed);
        done();
      });
    });
  });

  describe('stop()', function() {
    it('should stop the ticker', function(done) {
      ticker.on('update', done);
      ticker.stop();
      done();
    });
  });

  describe('resume()', function() {
    it('should set the previous time and start ticking', function() {
      assert.strictEqual(ticker._previous, null);
      assert.strictEqual(ticker._handle, null);

      ticker.resume();

      assert.notStrictEqual(ticker._previous, null);
      assert.notStrictEqual(ticker._handle, null);
    });
  });

});
