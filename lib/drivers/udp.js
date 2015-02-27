var dgram = require('dgram');

function UDP(config){
    this.config = config;
}

UDP.prototype.connect = function(){
    this.driver = dgram.createSocket('upd4');
};

UDP.prototype.onConnect = function(){

};

UDP.prototype.send = function(buffer){
    this.driver.send(buffer,
                     0,
                     buffer.length,
                     this.config.port,
                     this.config.host,
                     this.onConnect.bind(this)
                    );
};

UPD.type = 'upd';


module.exports = UDP;
