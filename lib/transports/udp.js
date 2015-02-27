var dgram = require('dgram');
var extend = require('gextend');

var DEFAULTS = {
    autoinitialize:true
};

var UDP = function(config){
    config = extend({}, this.constructor.DEFAULTS, config);
    if(config.autoinitialize ) this.init(config);
};

UDP.type = 'upd';
UDP.DEFAULTS = DEFAULTS;

UDP.prototype.init = function(config){
    if(this.initialized) return;
    this.initialized = true;

    extend(this, this.constructor.DEFAULTS, config);

    this.driver = dgram.createSocket('udp4');
};

UDP.prototype.onConnect = function(){
    console.log('CONNECT', arguments)
};

UDP.prototype.send = function(buffer){
    console.log('SEND', buffer, this.host, this.port)
    this.driver.send(buffer,
                     0,
                     buffer.length,
                     this.port,
                     this.host,
                     this.onConnect.bind(this)
                    );
};

UDP.prototype.logger = console;

module.exports = UDP;
