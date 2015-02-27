var Driver = require('../lib/driver');

var d = new Driver({
    clientOptions:{
        host:'192.168.1.148'
    }
});

d.send([0x41, 0x00]);
