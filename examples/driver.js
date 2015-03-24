var Driver = require('../lib/driver');

var d = new Driver({
    protocol: 'udp',
    clientOptions:{
        host:'192.168.1.148'
    }
});

var cmds = require('../lib/commands/rgbw');
[
    // cmds.ALL_ON,
    cmds.DISCO_FASTER,
    // cmds.SET_COLOR_TO_ROYAL_MINT
].forEach(function(cmd, i){
    setTimeout(function(){
        d.send(cmd);
    }, i * 3000);
});


var e = new Driver({
    protocol:'udp',
    clientOptions:{
        host:'192.168.1.144'
    }
});

e.on('connect', function(){
    console.log('EVENT', arguments)
})

var wcmd = require('../lib/commands/white');
[
    wcmd.ALL_ON,
    wcmd.GROUP2_BRIGHTNESS_MAX,
    wcmd.GROUP2_NIGHT_MODE
].forEach(function(cmd, i){
    setTimeout(function(){
        e.send(cmd);
    }, i * 3000);
});
