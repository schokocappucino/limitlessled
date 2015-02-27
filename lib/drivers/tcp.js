var net = require('net');

function TCP(config){
    this.config = config;
}

TCP.prototype.connect = function(){
    this.driver = net.connect(this.config, this.onConnect);
};

TCP.prototype.onConnect = function(){

};

TCP.prototype.send = function(buffer){
    this.driver.write(buffer);
};

TCP.type = 'tcp';


module.exports = TCP;
