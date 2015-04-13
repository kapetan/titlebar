var util = require('util');
var fs = require('fs');

var png = fs.readFileSync(__dirname + '/stoplight.png');
var url = 'data:image/png;base64,' + png.toString('base64');

module.exports = url;
