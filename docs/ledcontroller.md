

<!-- Start lib/ledcontroller.js -->

## Controller(config)

Controller constructor

### Params:

* **Object** *config* Options object

```javascript
var Controller = function(config) {
    config = extend({}, this.constructor.DEFAULTS, config);

    events.EventEmitter.call(this);

    if (config.autoinitialize) this.init(config);
};

util.inherits(Controller, events.EventEmitter);

Controller.DEFAULTS = DEFAULTS;
```

## init(config)

Initialize the `Controller` instance

### Params:

* **Object** *config* Options object

### Return:

* **this** 

```javascript
Controller.prototype.init = function(config) {
    if (this.initialized) return;
    this.initialized = true;

    extend(this, this.constructor.DEFAULTS, config);

    return this;
};
```

## sendMessage(command, callback)

Sends a message over `UDP` to the bridge

### Params:

* **Number** *command* Hex code

* **Function** *callback* 

### Return:

* **void** 

```javascript
Controller.prototype.sendMessage = function(command, callback) {
    var msg = new Buffer([command, VALUE, EXTENSION]);
    var socket = dgram.createSocket('udp4');
    socket.send(msg, 0, msg.length, this.port, this.host, function(err, dat) {
        socket.close();
        if (callback) callback(err, dat);
    });
};
```

## brighten(callback)

Sends brighten command

### Params:

* **Function** *callback* 

### Return:

* **this** 

```javascript
Controller.prototype.brighten = function(callback) {
    this.sendMessage(BRIGHTEN_CMD, callback);
    return this;
};
```

## dim(callback)

Sends dim command

### Params:

* **Function** *callback* 

### Return:

* **this** 

```javascript
Controller.prototype.dim = function(callback) {
    this.sendMessage(DIM_CMD, callback);
    return this;
};
```

## warmerColor(callback)

Sends warmer color command

### Params:

* **Function** *callback* 

### Return:

* **this** 

```javascript
Controller.prototype.warmerColor = function(callback) {
    this.sendMessage(WARM_COLOR_UP_CMD, callback);
    return this;
};
```

## coolerColor(callback)

Sends cooler color command

### Params:

* **Function** *callback* 

### Return:

* **this** 

```javascript
Controller.prototype.coolerColor = function(callback) {
    this.sendMessage(COOL_COLOR_UP_CMD, callback);
    return this;
};
```

## all()

Sets `activeZone` to all zones.

### Return:

* **this** 

```javascript
Controller.prototype.all = function() {
    this.previousActive = this.activeZone;
    this.activeZone = 0;
    return this;
};
```

## zone(id)

Set the `activeZone` which should
be between 1 and 4

### Params:

* **int** *id* Zone id

### Return:

* **this** 

```javascript
Controller.prototype.zone = function(id) {
    if (id < 0 || id > 4) id = 1;
    this.activeZone = id;
    return this;
};
```

## ledsOn(callback)

Turn led bulbs of a zone **on**, using `activeZone`

### Params:

* **Function** *callback* 

### Return:

* **this** 

```javascript
Controller.prototype.ledsOn = function(callback) {
    this.sendMessage(ZONES[this.activeZone].on, this._onLedCommand.bind(this, callback));
    return this;
};
```

## ledsOff(callback)

Turn led bulbs of a zone **off**, using `activeZone`

### Params:

* **Function** *callback* 

### Return:

* **this** 

```javascript
Controller.prototype.ledsOff = function(callback) {
    this.sendMessage(ZONES[this.activeZone].off, callback, this._onLedCommand.bind(this, callback));
};
```

## _onLedCommand(callback, err, dat)

Led command complete handler

### Params:

* **Function** *callback* 

* **Object** *err* 

* **Object** *dat* 

### Return:

* **void** 

```javascript
Controller.prototype._onLedCommand = function(callback, err, dat) {
    console.log('ON LED COMMAND', arguments)
    if (!this.previousActive) return;
    this.activeZone = this.previousActive;
    this.previousActive = null;
    callback(err, dat);
};

Controller.prototype.logger = console;

module.exports = Controller;
```

<!-- End lib/ledcontroller.js -->

