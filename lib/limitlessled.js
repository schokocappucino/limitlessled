/*
 * limitlessled
 * https://github.com/goliatone/limitlessled
 *
 * Copyright (c) 2015 goliatone
 * Licensed under the MIT license.
 */
'use strict';

var dgram = require('dgram');

var DEFAULTS = {
    port: 8899,
    host:'192.168.1.144',
    activeZone:1
};

var ZONES =[
    {on: 0x38, off: 0x3B},
    {on: 0x38, off: 0x3B},
    {on: 0x3D, off: 0x33},
    {on: 0x37, off: 0x3A},
    {on: 0x32, off: 0x36},
];

var Controller = {

};

Controller.config = function(options){

};

Controller.setHost = function(host){
    this.host = host;
    return this;
};

Controller.setPort = function(port){
    this.port = port;
    return this;
};

Controller.sendMessage = function(command, callback, host, port){
    var msg = new Buffer([command, 0x00, 0x55]);
    var socket = dgram.createSocket('udp4');
    socket.send(msg, 0, msg.length, port, host, function(e, b){
        socket.close();
        if(callback) callback(e, id);
    });
};


Controller.turnOn = function(callback, id){
    this.sendMessage(0x35, callback, this.host, this.port);
    return this;
};


Controller.turnOff = function(callback, id){
    this.sendMessage(0x39, callback, this.host, this.port);
};

Controller.brighten = function(callback, id){
    this.sendMessage(0x3C, callback, this.host, this.port);
};

Controller.dim = function(callback, id){
    this.sendMessage(0x34, callback, this.host, this.port);
};

Controller.warmUp = function(callback, id){
    this.sendMessage(0x3E, callback, this.host, this.port);
};

Controller.coolDown = function(callback, id){
    this.sendMessage(0x3F, callback, this.host, this.port);
};

Controller.zone = function(id){
    if(id < 1 || id > 4) id = 1;
    this.activeZone = id;
    return this;
};

Controller.on = function(callback){
    this.sendMessage(ZONES[this.activeZone].on, callback, this.host, this.port);
};

Controller.off = function(callback){
    this.sendMessage(ZONES[this.activeZone].off, callback, this.host, this.port);
};





module.exports = Controller;
