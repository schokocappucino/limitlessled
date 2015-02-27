var Driver = require('../lib/driver');

var d = new Driver({
    protocol:'tcp',
    clientOptions:{
        host:'192.168.1.148'
    }
});

setTimeout(function(){

    d.send([0x42, 0x00]);
},20)
