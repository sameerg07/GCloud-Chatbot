var NodeWebcam = require( "node-webcam" );
//Default options
var opts = {
    //Picture related
    width: 1280,
    height: 720,
    quality: 100,
    delay: 0,
    saveShots: true,
    output: "jpeg",
    device: false,
    callbackReturn: "location",
    verbose: false,
};

var Webcam = NodeWebcam.create( opts );
NodeWebcam.capture( "test_picture", opts, function( err, data ) {
  console.log(data);
});
