var repl = require('repl');
var LedController = require('../lib/ledcontroller');

console.log('Controller available on c and controller variables');
var ledRepl = repl.start({
  prompt: 'led-repl> ',
  input: process.stdin,
  output: process.stdout
}).on('exit', function () {
  console.log('Goodbye.');
  // zwave.disconnect();
  process.exit();
});

var leds = new LedController({
    port: 8899,
    host: '192.168.1.144'
});


ledRepl.context.c = leds;
ledRepl.context.controller = leds;