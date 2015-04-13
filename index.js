var events = require('events');
var util = require('util');
var fs = require('fs');
var defaultcss = require('defaultcss');
var domify = require('domify');

var stoplight = require('./stoplight');

var style = fs.readFileSync(__dirname + '/index.css', 'utf-8');
var html = fs.readFileSync(__dirname + '/index.html', 'utf-8');

style = util.format(style, stoplight);

var $ = function(selector, context) {
	context = context || document;
	return context.querySelector(selector);
};

var TitleBar = function(options) {
	if(!(this instanceof TitleBar)) return new TitleBar(options);

	events.EventEmitter.call(this);
	this._options = options || {};

	var element = domify(html);
	this.element = element;

	var self = this;
	var close = $('.titlebar-close', element);
	var minimize = $('.titlebar-minimize', element);
	var fullscreen = $('.titlebar-fullscreen', element);

	element.addEventListener('click', function(e) {
		if(e.target === close) self.emit('close', e);
		if(e.target === minimize) self.emit('minimize', e);
		if(e.target === fullscreen) self.emit('fullscreen', e);
	}, false);

	element.addEventListener('dblclick', function(e) {
		if(e.target === close || e.target === minimize || e.target === fullscreen) return;
		self.emit('maximize', e);
	}, false);
};

util.inherits(TitleBar, events.EventEmitter);

TitleBar.prototype.appendTo = function(element) {
	if(typeof element === 'string') element = $(element);
	if(this._options.style !== false) defaultcss('titlebar', style);
	element.appendChild(this.element);
	return this;
};

module.exports = TitleBar;
