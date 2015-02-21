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

// leds.all().ledsOn(function(){
//     console.log('ON LEDS ON');
//     leds.zone(3).coolerColor(cool);
// });


setTimeout(function(){
    leds.all().ledsOff();
}, 2000);

setTimeout(function(){
    leds.all().ledsOn();
}, 4000);
/***************************************
* And here's the block where we setup
* keybindings to allow manual changes
********************************************/
var stdin = process.stdin;
stdin.setRawMode( true );
stdin.resume();

stdin.on( 'data', function( key ){
    if(key == '\x03'){
        //ctrl+c was pressed.
        process.exit()
    }else if(key == "\x1B\x5BC"){
        //Right arrow key was pressed; cycle forwards through the colors.
        leds.zone(3).coolerColor();
    }else if(key == "\x1B\x5BD"){
        //Left arrow key.  cycle backwards through the colors.
        leds.zone(3).warmerColor();
    }else if(key == "\x1B\x5BA"){
        //up arrow key.  increase the brightness level.
        leds.brighten();
    }else if(key == "\x1B\x5BB"){
        //down arrow key.  decrease the brightness level.
        leds.dim();
    }else{
        console.log(key);
        //we don't know what 2key was pressed.
        //uncomment the following to log the keypress so it can be implemented.
        //process.stdout.write( escape(key) )
    }
});