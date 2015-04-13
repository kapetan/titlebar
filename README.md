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
```

The returned instance emits four events: `close`, `minimize`, `fullscreen` (each corresponding to one of the stoplight buttons) and `maximize` when double clicking on the titlebar area.

Holding down alt key to change the `fullscreen` button to `maximize` is not yet supported.
