var dgram = require('dgram');
var extend = require('gextend');
var util = require("util");
var events = require("events");

var DEFAULTS = {
    autoinitialize: true,
    repeatSendCommand: 1,
    sendCommandInterval: 100
};

var UDP = function(config){
    events.EventEmitter.call(this);
    config = extend({}, this.constructor.DEFAULTS, config);
    if(config.autoinitialize ) this.init(config);
};

util.inherits(UDP, events.EventEmitter);

UDP.type = 'upd';
UDP.DEFAULTS = DEFAULTS;

UDP.prototype.init = function(config){
    if(this.initialized) return;
    this.initialized = true;

    extend(this, this.constructor.DEFAULTS, config);

    this.driver = dgram.createSocket('udp4');
};

UDP.prototype.onConnect = function(){
    this.driver = null;
    var args = Array.prototype.slice.call(arguments);
    this.emit.call(this, ['connect'].concat(args));
};

UDP.prototype.send = function(buffer){
    this.driver = dgram.createSocket('udp4');

    var i = 0,
        MAX = this.repeatSendCommand,
        INT = this.sendCommandInterval;

    var _done = function(err, dat){
        i++;
        if(i !== MAX) return setTimeout(_send, INT);
        this.emit('complete', err, dat);
    }.bind(this);

    var _send = function(){

        this.driver.send(buffer,
             0,
             buffer.length,
             this.port,
             this.host,
             _done
            );
    }.bind(this);

    _send();
};

UDP.prototype.logger = console;

module.exports = UDP;
