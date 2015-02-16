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
Controller.prototype.sendMessage = function(command, callback){
    var msg = new Buffer([command, VALUE, EXTENSION]);
    var socket = dgram.createSocket('udp4');
    socket.send(msg, 0, msg.length, this.port, this.host, function(err, dat){
        socket.close();
        if(callback) callback(err, dat);
    });
};

/**
 * Sends brighten command
 * @param  {Function} callback
 * @return {this}
 */
Controller.prototype.brighten = function(callback){
    this.sendMessage(BRIGHTEN_CMD, callback);
    return this;
};

/**
 * Sends dim command
 * @param  {Function} callback
 * @return {this}
 */
Controller.prototype.dim = function(callback){
    this.sendMessage(DIM_CMD, callback);
    return this;
};

/**
 * Sends warmer color command
 * @param  {Function} callback
 * @return {this}
 */
Controller.prototype.warmerColor = function(callback){
    this.sendMessage(WARM_COLOR_UP_CMD, callback);
    return this;
};

/**
 * Sends cooler color command
 * @param  {Function} callback
 * @return {this}
 */
Controller.prototype.coolerColor = function(callback){
    this.sendMessage(COOL_COLOR_UP_CMD, callback);
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


/**
 * Turn led bulbs of a zone **on**, using `activeZone`
 * @param  {Function} callback
 * @return {this}
 */
Controller.prototype.ledsOn = function(callback){
    this.sendMessage(ZONES[this.activeZone].on, this._onLedCommand.bind(this, callback));
    return this;
};

/**
 * Turn led bulbs of a zone **off**, using `activeZone`
 * @param  {Function} callback
 * @return {this}
 */
Controller.prototype.ledsOff = function(callback){
    this.sendMessage(ZONES[this.activeZone].off, callback, this._onLedCommand.bind(this, callback));
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
    callback(err, dat);
};

Controller.prototype.logger = console;

module.exports = Controller;
