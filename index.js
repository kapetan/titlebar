var events = require('events');
var util = require('util');
var fs = require('fs');
var defaultcss = require('defaultcss');
var domify = require('domify');
var $ = require('dombo');

var ALT = 18;

var $window = $(window);
var styleMac = fs.readFileSync(__dirname + '/index-mac.css', 'utf-8');
var htmlMac = fs.readFileSync(__dirname + '/index-mac.html', 'utf-8');
var styleWin = fs.readFileSync(__dirname + '/index-win.css', 'utf-8');
var htmlWin = fs.readFileSync(__dirname + '/index-win.html', 'utf-8');

var TitleBar = function(options) {
	if(!(this instanceof TitleBar)) return new TitleBar(options);

	events.EventEmitter.call(this);
	this._options = options || {};

	if (this._options.os == 'mac' && this._options.os == 'win'){
		if (process.platform == 'darwin') this._options.os = 'mac';
		else if (process.platform == 'win32') this._options.os = 'win';
		else {
			console.error('No supported os style type was given. Using OS X style as default.')
			this._options.os = 'mac';
		}
	}
	if (this._options.os == 'mac') var html = htmlMac;
	else if (this._options.os == 'win') var html = htmlWin;
	var element = domify(html);
	var $element = $(element);
	this.element = element;

	if(this._options.draggable !== false) $element.addClass('webkit-draggable');

	var self = this;
	var close = $('.titlebar-close', element)[0];
	var minimize = $('.titlebar-minimize', element)[0];
	var maximize = $('.titlebar-maximize', element)[0];
	var fullscreen = $('.titlebar-fullscreen', element)[0];

	var os = this._options.os;

	$element.on('click', function(e) {
		var target = e.target;
		if(close.contains(target)) self.emit('close', e);
		else if(minimize.contains(target)) self.emit('minimize', e);
		else if (os == 'mac'){
			if(fullscreen.contains(target)) {
				if(e.altKey) self.emit('maximize', e);
				else self.emit('fullscreen', e);
			}
		}
		else if (os == 'win'){
			if(maximize.contains(target)) {
				if($element.hasClass('maximized')){
					self.emit('unmaximize', e);
					$element.removeClass('maximized');
				} else {
					self.emit('maximize', e);
					$element.addClass('maximized');
				}
			}
		}
	});

	$element.on('dblclick', function(e) {
		var target = e.target;
		if(close.contains(target) || minimize.contains(target) || fullscreen.contains(target)) return;
		self.emit('maximize', e);
	});
};

util.inherits(TitleBar, events.EventEmitter);

TitleBar.prototype.appendTo = function(target) {
	if (this._options.os == 'mac') var style = styleMac;
	else if (this._options.os == 'win') var style = styleWin;

	if(typeof target === 'string') target = $(target)[0];
	if(this._options.style !== false) defaultcss('titlebar', style);

	var $element = $(this.element);

	$window.on('keydown', this._onkeydown = function(e) {
		if(e.keyCode === ALT) $element.addClass('alt');
	});

	$window.on('keyup', this._onkeyup = function(e) {
		if(e.keyCode === ALT) $element.removeClass('alt');
	});

	target.appendChild(this.element);
	return this;
};

TitleBar.prototype.destroy = function() {
	var parent = this.element.parentNode;
	if(parent) parent.removeChild(this.element);
	$window.off('keydown', this._onkeydown);
	$window.off('keyup', this._onkeyup);
	return this;
};

module.exports = TitleBar;
