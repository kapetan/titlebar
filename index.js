var events = require('events');
var util = require('util');
var fs = require('fs');
var defaultcss = require('defaultcss');
var domify = require('domify');
var $ = require('dombo');

var stoplight = require('./stoplight');

var ALT = 18;

var $window = $(window);
var style = fs.readFileSync(__dirname + '/index.css', 'utf-8');
var html = fs.readFileSync(__dirname + '/index.html', 'utf-8');

style = util.format(style, stoplight);

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
		if(e.target === close) self.emit('close', e);
		else if(e.target === minimize) self.emit('minimize', e);
		else if(e.target === fullscreen && e.altKey) self.emit('maximize', e);
		else if(e.target === fullscreen) self.emit('fullscreen', e);
	});

	$element.on('dblclick', function(e) {
		if(e.target === close || e.target === minimize || e.target === fullscreen) return;
		self.emit('maximize', e);
	});

	$window.on('keydown', this._onkeydown = function(e) {
		if(e.keyCode === ALT) $element.addClass('alt');
	});

	$window.on('keyup', this._onkeyup = function(e) {
		if(e.keyCode === ALT) $element.removeClass('alt');
	});
};

util.inherits(TitleBar, events.EventEmitter);

TitleBar.prototype.appendTo = function(element) {
	if(typeof element === 'string') element = $(element)[0];
	if(this._options.style !== false) defaultcss('titlebar', style);
	element.appendChild(this.element);
	return this;
};

TitleBar.prototype.destroy = function() {
	var parent = this.element.parentNode;
	if(parent) parent.removeChild(this.element);
	$window.off('keydown', this._onkeydown);
	$window.off('keyup', this._onkeyup);
};

module.exports = TitleBar;
