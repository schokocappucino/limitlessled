var util = require("util");
var dgram = require('dgram');
var extend = require('gextend');
var events = require("events");

var DEFAULTS = {
    autoinitialize: true,
    port: 8899,
    host: '192.168.1.100',
    activeZone: 1
};

var ZONES = [
    {on: 0x35, off: 0x39, label: 'All'},
    {on: 0x38, off: 0x3B, label: 'Zone1'},
    {on: 0x3D, off: 0x33, label: 'Zone2'},
    {on: 0x37, off: 0x3A, label: 'Zone3'},
    {on: 0x32, off: 0x36, label: 'Zone4'},
];


var VALUE              = 0x00;
var EXTENSION          = 0x55;
var DIM_CMD            = 0x34;
var BRIGHTEN_CMD       = 0x3C;
var WARM_COLOR_UP_CMD  = 0x3E;
var COOL_COLOR_UP_CMD  = 0x3F;
var ALL_LIGHTS_ON_CMD  = ZONES[0].on;
var ALL_LIGHTS_OFF_CMD = ZONES[0].off;


var Controller = function(config){
    config = extend({}, this.constructor.DEFAULTS, config);

    events.EventEmitter.call(this);

    if(config.autoinitialize ) this.init(config);
};

util.inherits(Controller, events.EventEmitter);

Controller.DEFAULTS = DEFAULTS;

Controller.prototype.init = function(config){
    if(this.initialized) return;
    this.initialized = true;

    extend(this, this.constructor.DEFAULTS, config);

};

Controller.prototype.sendMessage = function(command, callback){
    var msg = new Buffer([command, VALUE, EXTENSION]);
    var socket = dgram.createSocket('udp4');
    socket.send(msg, 0, msg.length, this.port, this.host, function(err, dat){
        socket.close();
        if(callback) callback(err, dat);
    });
};

Controller.prototype.brighten = function(callback, id){
    this.sendMessage(BRIGHTEN_CMD, callback);
    return this;
};

Controller.prototype.dim = function(callback, id){
    this.sendMessage(DIM_CMD, callback);
    return this;
};

Controller.prototype.brighten = function(callback, id){
    this.sendMessage(BRIGHTEN_CMD, callback);
    return this;
};

Controller.prototype.warmerColor = function(callback, id){
    this.sendMessage(WARM_COLOR_UP_CMD, callback);
    return this;
};

Controller.prototype.coolerColor = function(callback, id){
    this.sendMessage(COOL_COLOR_UP_CMD, callback);
    return this;
};

Controller.prototype.all = function(){
    this.previousActive = this.activeZone;
    this.activeZone = 0;
    return this;
};

Controller.prototype.zone = function(id){
    if(id < 0 || id > 4) id = 1;
    this.activeZone = id;
    return this;
};

Controller.prototype._onLedCommand = function(callback, err, dat){
    console.log('ON LED COMMAND', arguments)
    if(!this.previousActive) return;
    this.activeZone = this.previousActive;
    this.previousActive = null;
    callback(err, dat);
};

Controller.prototype.ledsOn = function(callback){
    this.sendMessage(ZONES[this.activeZone].on, this._onLedCommand.bind(this, callback));
};

Controller.prototype.ledsOff = function(callback){
    this.sendMessage(ZONES[this.activeZone].off, callback, this._onLedCommand.bind(this, callback));
};


Controller.prototype.logger = console;

module.exports = Controller;
