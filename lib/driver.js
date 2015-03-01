var extend = require('gextend');
var util = require("util");
var events = require("events");

var DEFAULTS = {
    autoinitialize: true,
    protocol: 'udp',
    CLOSING_BYTE: 0X55,
    clientOptions: {
        port: 8899,
        host: '192.168.1.100'
    }
};

var Driver = function(config){
    events.EventEmitter.call(this);
    config = extend({}, this.constructor.DEFAULTS, config);
    if(config.autoinitialize ) this.init(config);
};

util.inherits(Driver, events.EventEmitter);

Driver.DEFAULTS = DEFAULTS;

Driver.prototype.init = function(config){
    if(this.initialized) return;
    this.initialized = true;

    extend(this, this.constructor.DEFAULTS, config);

    var Transport = require('./transports/' + this.protocol);
    this.transport = new Transport(this.clientOptions);
    // this.transport.on('complete', this.onComplete.bind(this));
};

Driver.prototype.onComplete = function(){
    this.logger.log('complete');
};

Driver.prototype.send = function(commands){
    var buffer = new Buffer(commands.concat(this.CLOSING_BYTE), 'hex');
    this.logger.log('SEND:', buffer);
    this.transport.send(buffer);
};

Driver.prototype.logger = console;

module.exports = Driver;
