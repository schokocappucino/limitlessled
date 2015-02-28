var net = require('net');
var dgram = require('dgram');
var extend = require('gextend');

var DEFAULTS = {
    autoinitialize: true
    // port: Port the client should connect to (Required).
    // host: Host the client should connect to. Defaults to 'localhost'.
    // localAddress: Local interface to bind to for network connections.
    // localPort: Local port to bind to for network connections.
    // family : Version of IP stack. Defaults to 4.
};

var TCP = function(config){
    config = extend({}, this.constructor.DEFAULTS, config);
    if(config.autoinitialize ) this.init(config);
};

TCP.type = 'tcp';
TCP.DEFAULTS = DEFAULTS;

TCP.prototype.init = function(config){
    if(this.initialized) return;
    this.initialized = true;

    extend(this, this.constructor.DEFAULTS, config);

    this.protocol = net.connect({port:this.port, host:this.host}, this.onConnect);
    this.protocol.on('error', function (e) {
        console.error('ERROR', e)
    });
};

TCP.prototype.onConnect = function(){
    console.log('CONNECT', arguments)
};

TCP.prototype.send = function(buffer){
    console.log('SEND', buffer, this.host, this.port)
    this.protocol.write(buffer);
};

TCP.prototype.logger = console;

module.exports = TCP;
