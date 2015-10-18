var events = require('events');
var util = require('util');
var fs = require('fs');
var defaultcss = require('defaultcss');
var domify = require('domify');
var $ = require('dombo');

var ALT = 18;

var $window = $(window);
var style = fs.readFileSync(__dirname + '/index.css', 'utf-8');
var html = fs.readFileSync(__dirname + '/index.html', 'utf-8');

var TitleBar = function(options) {
	if(!(this instanceof TitleBar)) return new TitleBar(options);

	events.EventEmitter.call(this);
	this._options = options || {};

	var element = domify(html);
	var $element = $(element);
	this.element = element;

	if(this._options.draggable !== false) $element.addClass('webkit-draggable');

	var self = this;
	var close = $('.titlebar-close', element)[0];
	var minimize = $('.titlebar-minimize', element)[0];
	var fullscreen = $('.titlebar-fullscreen', element)[0];

	$element.on('click', function(e) {
		var target = e.target;
		if(close.contains(target)) self.emit('close', e);
		else if(minimize.contains(target)) self.emit('minimize', e);
		else if(fullscreen.contains(target)) {
			if(e.altKey) self.emit('maximize', e);
			else self.emit('fullscreen', e);
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
