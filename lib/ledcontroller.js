var util = require("util");
var dgram = require('dgram');
var extend = require('gextend');
var events = require("events");

var DEFAULTS = {
    autoinitialize: true,
    port: 8899,
    host: '192.168.1.100',
    activeZone: 1,
    repeatSendCommand: 8,
    sendCommandInterval: 100
};


var ZONES = [
    {on: 0x35, off: 0x39, nightMode:0xB9, fullMode:0xB5, label: 'All'},

    {on: 0x38, off: 0x3B, nightMode: 0xBB, fullMode: 0xB8, label: 'Zone1'},
    {on: 0x3D, off: 0x33, nightMode: 0xB3, fullMode: 0xBD, label: 'Zone2'},
    {on: 0x37, off: 0x3A, nightMode: 0xBA, fullMode: 0xB7, label: 'Zone3'},
    {on: 0x32, off: 0x36, nightMode: 0xB6, fullMode: 0xB2, label: 'Zone4'},
];


var VALUE              = 0x00;
var EXTENSION          = 0x55;

var DIM_CMD            = 0x34;
var BRIGHTEN_CMD       = 0x3C;
var SET_COLOR_CMD      = 0x40;
var SET_BRIGHTNESS_CMD = 0x4E;
var WARM_COLOR_UP_CMD  = 0x3E;
var COOL_COLOR_UP_CMD  = 0x3F;
var ALL_LIGHTS_ON_CMD  = ZONES[0].on;
var ALL_LIGHTS_OFF_CMD = ZONES[0].off;

var ALL_LIGHTS_FULL_CMD = ZONES[0].fullMode;//0xB5;
var ALL_LIGHTS_NIGHTMODE_CMD = ZONES[0].nightMode;//0xB9;

/**
 * Controller constructor
 * @param {Object} config Options object
 */
var Controller = function(config){
    config = extend({}, this.constructor.DEFAULTS, config);

    events.EventEmitter.call(this);

    if(config.autoinitialize ) this.init(config);
};

util.inherits(Controller, events.EventEmitter);

Controller.DEFAULTS = DEFAULTS;

/**
 * Initialize the `Controller` instance
 * @param  {Object} config Options object
 * @return {this}
 */
Controller.prototype.init = function(config){
    if(this.initialized) return;
    this.initialized = true;

    extend(this, this.constructor.DEFAULTS, config);

    return this;
};

/**
 * Sends a message over `UDP` to the bridge
 * @param  {Number}   command  Hex code
 * @param  {Function} callback
 * @return {void}
 */
Controller.prototype.sendCommand = function(command, callback, value){
    value || (value = VALUE);
    var msg = new Buffer([command, value, EXTENSION]);

    var i = 0,
        MAX = this.repeatSendCommand,
        INT = this.sendCommandInterval;

    var _done = function(err, dat){
        i++;
        if(i !== MAX) return setTimeout(_send, INT);
        if(callback) callback(err, dat);
    };

    var _send = function(){

        var socket = dgram.createSocket('udp4');
        console.log('SEND', msg)
        socket.send(msg, 0, msg.length, this.port, this.host, function(err, dat){
            socket.close();
            if(err) console.log('ERROR: ', err);
            _done(err, dat);
        });
    }.bind(this);

    _send();
};

/**
 * Sends brighten command
 * @param  {Function} callback
 * @return {this}
 */
Controller.prototype.brighten = function(callback){
    this.sendCommand(BRIGHTEN_CMD, callback);
    return this;
};

Controller.prototype.setColor = function(value, callback){
    this.sendCommand(SET_COLOR_CMD, callback, value);
    return this;
};

Controller.prototype.setBrightness = function(percent, callback){
    //value is from 0-100, should be converted to 2-27.
    var value = Math.floor(2 + ((percent / 100) * 25));
    //value should be hex
    value = struct.pack('B', value);
    console.log('VALUE', value)
    //command is 4E
    this.sendCommand(SET_BRIGHTNESS_CMD, callback, value);
    return this;
};

/**
 * Sends dim command
 * @param  {Function} callback
 * @return {this}
 */
Controller.prototype.dim = function(callback){
    this.sendCommand(DIM_CMD, callback);
    return this;
};

/**
 * Sends warmer color command
 * @param  {Function} callback
 * @return {this}
 */
Controller.prototype.warmerColor = function(callback){
    this.sendCommand(WARM_COLOR_UP_CMD, callback);
    return this;
};

/**
 * Sends cooler color command
 * @param  {Function} callback
 * @return {this}
 */
Controller.prototype.coolerColor = function(callback){
    this.sendCommand(COOL_COLOR_UP_CMD, callback);
    return this;
};

/**
 * Sets `activeZone` to all zones.
 * @return {this}
 */
Controller.prototype.all = function(){
    this.previousActive = this.activeZone;
    this.activeZone = 0;
    return this;
};

/**
 * Set the `activeZone` which should
 * be between 1 and 4
 * @param  {int} id Zone id
 * @return {this}
 */
Controller.prototype.zone = function(id){
    if(id < 0 || id > 4) id = 1;
    this.activeZone = id;
    return this;
};


//TODO: Fix recursion, for now only one clone works...curry
Controller.prototype.wait = function(delay){
    var wrap = function(clone, self, property, time){
        clone[prop] = function(){
            var args = arguments;
            setTimeout(function(){
                console.log('EXECUTE', property)
                clone.self[property].apply(clone.self, args);
            }, delay + time);
            return clone;
        };
    }
    var clone = {self: this}, self = this;

    for(var prop in this){
        if(typeof this[prop] === 'function'){
            wrap(clone, self, prop, delay)
        }
        console.log(prop)
    }

    return clone;
};

/**
 * Turn led bulbs of a zone **on**, using `activeZone`
 * @param  {Function} callback
 * @return {this}
 */
Controller.prototype.ledsOn = function(callback){
    this.sendCommand(ZONES[this.activeZone].on, this._onLedCommand.bind(this, callback));
    return this;
};

/**
 * Turn led bulbs of a zone **off**, using `activeZone`
 * @param  {Function} callback
 * @return {this}
 */
Controller.prototype.ledsOff = function(callback){
    this.sendCommand(ZONES[this.activeZone].off, callback, this._onLedCommand.bind(this, callback));
    return this;
};

Controller.prototype.fullColor = function(callback){
    this.sendCommand(ZONES[this.activeZone].fullMode, callback);
    return this;
};

Controller.prototype.nightMode = function(callback){
    this.sendCommand(ZONES[this.activeZone].nightMode, callback);
    return this;
};

/**
 * Led command complete handler
 * @param  {Function} callback
 * @param  {Object}   err
 * @param  {Object}   dat
 * @return {void}
 * @private
 */
Controller.prototype._onLedCommand = function(callback, err, dat){
    console.log('ON LED COMMAND', arguments)
    if(!this.previousActive) return;
    this.activeZone = this.previousActive;
    this.previousActive = null;
    if(callback) callback(err, dat);
};

Controller.prototype.logger = console;

module.exports = Controller;
