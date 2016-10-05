# ticker

> Simple event based game loop based on the Game Programming Patterns [Game Loop](http://gameprogrammingpatterns.com/game-loop.html) chapter.

## Install

```sh
$ npm install --save @callmehiphop/ticker
```

## Usage

```js
const Ticker = require('@callmehiphop/ticker');
const ticker = new Ticker();

ticker.on('update', (dt) => {
  // update all the things!
});

ticker.on('render', () => {
  // render all the things!
});

// stop the ticker
ticker.stop();

// resume the ticker
ticker.resume();
```

## API

### new Ticker(el, [fps])

#### el

Type: `canvas`

HTML element to be passed into `requestAnimationFrame` - presumably canvas.

#### fps

Type: `number`<br>
Default: `60`

Desired frames per second, this will alter how often the `update` event is fired.

```js
const canvas = document.getElementById('my-canvas');
const ticker = new Ticker(canvas, 30);
```

### ticker.on('update', handler)

Indicates models should be updated with provided delta time.

#### handler(dt)

Type: `function`

```js
ticker.on('update', (dt) => {
  // Update all your models.
});
```

### ticker.on('render', handler)

Indicates that you should draw the current state of your models.

#### handler(frameStep)

`frameStep` is how far into the current frame we are.

Type: `function`

```js
ticker.on('render', (frameStep) => {
  // Render all your models.
});
```

### ticker.stop()

Stops the ticker.

```js
ticker.stop();
```

### ticker.resume()

Resumes the ticker.

```js
ticker.resume();
```

## License

MIT
