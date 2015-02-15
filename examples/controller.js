var LedController = require('../lib/ledcontroller');


var leds = new LedController({
    port: 8899,
    host: '192.168.1.144'
});

var count = 0;
var max = 100;
function cool(){
    count++;
    console.log('COOL', count);
    if(count === max) return done('cool');
    leds.coolerColor(cool);
}

function warm(){
    count++;
    console.log('warm', count);
    if(count === max) return done('warm');
    leds.warmerColor(warm);
}

function done(state){
    count = 0;
    state === 'warm' ? cool() : warm();
}

leds.all().ledsOn(function(){
    console.log('ON LEDS ON');
    leds.zone(3).coolerColor(cool);
});