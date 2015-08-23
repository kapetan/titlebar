var util = require('util');
var fs = require('fs');
var React = require('react/addons');
var defaultcss = require('defaultcss');
var classNames = require('classnames');

var stoplight = require('./stoplight');
var style = fs.readFileSync(__dirname + '/index.css', 'utf-8');
style = util.format(style, stoplight);

var ALT = 18;

module.exports = React.createClass({

    getInitialState: function() {
        return {
            altDown: false,
            draggable: this.props.draggable,
        }
    },

    componentDidMount: function() {
        document.body.addEventListener('keydown', this.handleKeyDown);
        document.body.addEventListener('keyup', this.handleKeyUp);
    },

    componentWillUnMount: function() {
        document.body.removeEventListener('keydown', this.handleKeyDown);
        document.body.removeEventListener('keyup', this.handleKeyUp);
    },

    handleKeyDown: function(e) {
        if (e.keyCode === ALT) {
            this.setState({ altDown: true });
        }
    },

    handleKeyUp: function(e) {
        if (e.keyCode === ALT) {
            this.setState({ altDown: false });
        }
    },

    handleMaximize: function(e) {
        if (this.state.altDown) {
            // maximize
            this.props.handleMaximize(e);
        } else {
            this.props.handleFullScreen(e);
        }
    },

    // simply prevent event
    handleNop: function(e) {
        e.preventDefault();
        e.stopPropagation();
    },

    render: function() {
        var classes = classNames('titlebar',
        {
            'webkit-draggable': this.state.draggable,
            'alt': this.state.altDown,
        });

        // set default CSS
        defaultcss('titlebar', style);

        return (
            <div className={classes} id="titlebar">
            	<div className="titlebar-stoplight">
            		<div onDoubleClick={this.handleNop} onClick={this.props.handleClose} className="titlebar-close"></div>
            		<div onDoubleClick={this.handleNop} onClick={this.props.handleMinimize} className="titlebar-minimize"></div>
            		<div onDoubleClick={this.handleNop} onClick={this.handleMaximize} className="titlebar-fullscreen"></div>
            	</div>
                {this.props.children}
            </div>
        )
    }
});
