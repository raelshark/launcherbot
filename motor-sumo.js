'use strict';

var five = require('johnny-five');
var board = new five.Board();
var keypress = require('keypress');
// var cfble = require('crazyflie-ble');
var CF2 = require('crazyflie2-ble');
var conn = CF2.getConnection();

// var player = require('play-sound')(opts = {});

board.on('ready', function () {
  // Use your shield configuration from the list
  // http://johnny-five.io/api/motor/#pre-packaged-shield-configs
  var configs = five.Motor.SHIELD_CONFIGS.ADAFRUIT_V1;
  var motors = new five.Motors([
    configs.M1,
    configs.M2
  ]);

  // If you want to add a servo to your motor shield:
  // You can also use continuous servos: new five.Servo.Continuous(10)
  var servo1 = new five.Servo(10);

  this.repl.inject({
    motors: motors,
    servo1: servo1
  });

  console.log('Welcome to the Motorized SumoBot!');
  console.log('Control the bot with the arrow keys, and SPACE to stop.');

  function forward() {
    console.log('Going forward');
    motors.fwd(230);
  }

  function backward() {
    console.log('Going backward');
    motors.rev(230);
  }

  function left() {
    console.log('Going left');
    motors[0].rev(200);
    motors[1].fwd(200);
  }

  function right() {
    console.log('Going right');
    motors[1].rev(200);
    motors[0].fwd(200);
  }

  function stop() {
    motors.stop();

    // Optionally, stop servos from sweeping
    servo1.stop();
  }

  function sweep() {
    console.log('Sweep the leg!!');

    // Sweep from 0-180 (repeat)
    servo1.sweep();
  }

  function turbo() {
    console.log('Turbo button engaged!');

    motors.fwd(255);
  }

  function attack() {
    console.log('Attack!');

    motors.fwd(100);
    setTimeout(phase2, 1000);
  }

  function phase2() {
    motors.stop();

    launch();

    console.log('launching!');
  }

  keypress(process.stdin);
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  process.stdin.setRawMode(true);
  process.stdin.on('keypress', function (ch, key) {
    if ( !key ) { return; }
    if ( key.name === 'q' ) {
      console.log('Quitting');
      stop();
      process.exit();
    } else if ( key.name === 'up' ) {
      forward();
    } else if ( key.name === 'down' ) {
      backward();
    } else if ( key.name === 'left' ) {
      left();
    } else if ( key.name === 'right' ) {
      right();
    } else if ( key.name === 'space' ) {
      stop();
    } else if ( key.name === 's' ) {
      sweep();
    } else if ( key.name === 't' ) {
      turbo();
    } else if ( key.name === 'a' ) {
      attack();
    } else if ( key.name === 'h' ) {
      console.log('hover test');
      launch();
    }
  });
});

var launch = function () {
  console.log('Connecting to Crazyflie');
  conn.then(function (crazyflie) {
    console.log('take off');
    crazyflie.setThrust(42000);
    setTimeout(hover, 2000, crazyflie);
  }).catch(function (error) {
    // Something went wrong :(
    console.error('outer', error.message);
  });
};

var hover = function (crazyflie) {
  console.log('hover');
  crazyflie.setThrust(38000);

  setTimeout(descend, 2000, crazyflie);
};
var descend = function (crazyflie) {
  console.log('land');
  crazyflie.setThrust(0);
};
