# titlebar

Emulate OS X window title bar. Extracted from [mafintosh/playback](https://github.com/mafintosh/playback). See the [live demo](http://kapetan.github.io/titlebar/demo/index.html).

	npm install titlebar

# Usage

Used with browserify or in a similar enviroment.

```javascript
var titlebar = require('titlebar');

var t = titlebar();
t.appendTo(document.body);

t.on('close', function(e) {
	console.log('close');
});

// t.element exposes the root dom element
t.element.appendChild(document.createElement('div'));

// Clean up after usage
t.destroy();
```

The returned instance emits four events: `close`, `minimize`, `fullscreen` (each corresponding to one of the stoplight buttons) and `maximize` when double clicking on the title bar area, or holding down alt key and clicking `fullscreen`.

The initializer function accepts an options object.

- `style` (default `true`): Disable default styling.
- `draggable` (default `true`): Disable the [-webkit-app-region](https://developer.chrome.com/apps/app_window) CSS property on the root element. Allows a frameless windows to be dragged in an `electron` application.
