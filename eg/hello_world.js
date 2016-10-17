var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {
  var led = new five.Led(13);
  led.blink(500);
  //led.off();

  console.log('Did you see a blink?');
});
