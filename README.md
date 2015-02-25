# [LimitlessLED][limitless] LED bulbs controller.

The `limitlessled` module provides a driver to connect and communicate over the network with the WiFi controller device. 

The WiFi bridge in it's default state act as a WiFi Access Point, providing standalone wireless network. It controls the LEDs acting as a RC. It can be configured to work over your LAN.

Note that the WiFi bridge should be connected to your LAN. Once it's configured and accessible over LAN you can control your LED bulbs.

This package provides a programmatic interface for the WiFi bridge.

Currently only the **Bright Dual White Light Bulb** is supported.


The driver uses UDP to communicate with the bridge, packets are dropped. 

-----

## Getting Started
Install the module with: `npm install limitlessled`

```javascript
var Controller = require('limitlessled');
var leds = new LedController({
    port: 8899,
    host:'192.168.1.1'
});

leds.all().ledsOn(function(){
    leds.zone(3).coolerColor();
});
```



## Documentation
You can check out the [documentation][documentation] directory.


## Examples
You can check out the [examples][examples] directory.


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Roadmap
- Add support for promises
- Fluid interface
- Add `after` method to execute methods with a delay
- State management: ie: cool/warm level (as command issued, unable to read state from bulbs)
- Events
- Support for the RGBW Color and White LED Light bulbs

## Release History
- v0.0.1: Initial release. 


## License
Copyright (c) 2015 goliatone  
Licensed under the MIT license.

[limitless]: http://limitlessled.com
[examples]: https://github.com/goliatone/limitlessled/tree/master/examples
[documentation]: https://github.com/goliatone/limitlessled/tree/master/docs