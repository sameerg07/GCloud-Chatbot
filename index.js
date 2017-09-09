'use strict';
var http = require('http'); //required for http requests
http.post = require('http-post'); //special http-post module present in npm, installed via npm, helpful for http.post
var NodeWebcam = require( "node-webcam" ); // Under testing for webcam and face recongition features using Kairos.

const host = 'api.worldweatheronline.com';  //weather api url
const wwoApiKey = '55b43550d8ad4d0fa78131934170609';


exports.ubiDotsAndWeather = (req, res) => {
  //----------------------------------TESTING PERSON FUNCTIONS START---------------------------//
  //Following function checks if the word "who" appears in the user request.
  // If it does, then it calls the callCameraApi for invoking camera API.
  // But, due to IoT restrictions / firewalls we're unable to take a picture directly.
  // Future versions would be to improvise with a seperate android app.
  if(req.body.result.parameters['person']=="who")
  {
    callCameraApi().then((output) => {
      // Return the results of the weather API to API.AI
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ 'speech': output, 'displayText': output }));
    }).catch((error) => {
      // If there is an error let the user know
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ 'speech': error, 'displayText': error }));
    });;
  }
  //----------------------------------TESTING PERSON FUNCTIONS END---------------------------//

  //----------------------------------TESTING MANUAL FUNCTIONS START---------------------------//
  var manual_mode;
  // Following functions work for majority of general cases, but not some corner cases.
  // Will imrpove in coming versions.
  if(req.body.result.parameters['Mode']=="Manual")
  {
    var manualFinal;
    if(req.body.result.parameters['manual_mode']=="Start" || req.body.result.parameters['manual_mode']=="Activate" || req.body.result.parameters['manual_mode']=="Intialize")
    {
      manualFinal=1;
    }
    if(req.body.result.parameters['manual_mode']=="Stop" || req.body.result.parameters['manual_mode']=="Deactivate" || req.body.result.parameters['manual_mode']=="Unintialize")
    {
      manualFinal=0;
    }
    callManualModeApi(manualFinal).then((output) => {
      // Return the results of the weather API to API.AI
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ 'speech': output, 'displayText': output }));
    }).catch((error) => {
      // If there is an error let the user know
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ 'speech': error, 'displayText': error }));
    });
  }
  //----------------------------------TESTING MANUAL FUNCTIONS END---------------------------//

  //----------------------------------WEATHER FUNCTIONS START--------------------------------//
   //Following functions call weather api from WWO. 
   //Use token and key. Location is a required component to be given by user.
   // Eg request : "Weather in Bangalore", if "bangalore" is missing, it jumps to weather.context functions in api.ai
   // returns the output of weather as returned in a promise from callWeatherApi.
 if(req.body.result.parameters['geo-city'] && manual_mode==0)
 {
    let city = req.body.result.parameters['geo-city']; // city is a required param
    let date = '';
    if (req.body.result.parameters['date']) {
      date = req.body.result.parameters['date'];
      console.log('Date: ' + date);
    }
    callWeatherApi(city, date).then((output) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ 'speech': output, 'displayText': output }));
    }).catch((error) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ 'speech': error, 'displayText': error }));
    });
  }
  //---------------------------------WEATHER FUNCTIONS END-----------------------------------//

  //---------------------------------UBIDOTS FUNCTIONS START---------------------------------//
  //Following functions get the "device--light/fan", "location--bedroom/kitchen" and "switch_state-on/off" from user.
  // fanspeeds -- 4-default(if no speed specified), 3-high, 2-medium, 1-low, 0-off.
  // Eg request : "Switch on kitchen light", "Switch on bedroom fan","switch on bedroom fan and set speed to high"
  // calls the callubidots function which makes an API call to ubidots IoT cloud, which communicates its value with NodeMCU
  //NodeMCU finally conveys the value to arduino, which does the physical on/off.

  if(req.body.result.parameters['object_name'] || req.body.result.parameters['object_location'] || req.body.result.parameters['switch_state'])
  {
    let objectName = req.body.result.parameters['object_name']; //light,fan
    let objectLocation = req.body.result.parameters['object_location'];  //kitchen,bedroom
    let switchState = req.body.result.parameters['switch_state']; //switch on/off
    let fanSpeed = req.body.result.parameters['fan_speed']; //switch on/off'
    
    console.log(fanSpeed);
    if(switchState=="switch on")
      switchState=1;
    else
      switchState=0;
    
      switch(fanSpeed)
      {
        case "high": fanSpeed=3;break;
        case "medium":fanSpeed=2;break;
        case "low": fanSpeed=1;break;
        case "off": fanSpeed=0;break;
        default: fanSpeed=4;
      }

    console.log(objectLocation,objectName,switchState,fanSpeed);
    callUbidotsApi(objectLocation,objectName,switchState,fanSpeed).then((output) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ 'speech': output, 'displayText': output }));
    }).catch((error) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ 'speech': error, 'displayText': error }));
    });  
  }
  //---------------------------------UBIDOTS FUNCTIONS END-----------------------------------//

};

//simple call camera app to capture photo, 
// doesn't work in gclud due to gcloud firewall restrictions,
// has to be run in Computer Engines (Or VMs) provided by gcloud.
function callCameraApi()
{
    return new Promise((resolve,reject)=>{
 
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
    let output="Person detected";
      resolve(output);
    });
    res.on('error', (error) => {
          reject(error);
    });
}
    
// the manual mode toggling api, as decribed above.    
function callManualModeApi(mode_val)
{
    return new Promise((resolve, reject) =>{
    http.get("http://things.ubidots.com/api/v1.6/variables?token=A1E-v8eYHn72rYMlAHfc1PsfOh87HFQnyB", (res) => {
      console.log("Status"+res.statusCode);
    });
    
    var json={};
    json["manual_mode"]=mode_val;
      http.post('http://things.ubidots.com/api/v1.6/devices/TEST/?token=A1E-v8eYHn72rYMlAHfc1PsfOh87HFQnyB', json, function(res){
        res.setEncoding('utf8');
        let body = '';
        res.on('data', (d) => { body += d; });
        res.on('end', () => {
          let response = JSON.parse(body);
          console.log(response);
          let output = "Device set to manual services:"+res.statusCode;
          console.log(output);
          resolve(output);
        });
        res.on('error', (error) => {
          reject(error);
        });
      });
  });
}


// The example weather api decribed in gcloud tutorial.
// Functioning as mentioned above.
function callWeatherApi (city, date) {
  return new Promise((resolve, reject) => {
    // Create the path for the HTTP request to get the weather
    let path = '/premium/v1/weather.ashx?format=json&num_of_days=1' +
      '&q=' + encodeURIComponent(city) + '&key=' + wwoApiKey + '&date=' + date;
    console.log('API Request: ' + host + path);
    // Make the HTTP request to get the weather
    http.get({host: host, path: path}, (res) => {
      let body = ''; // var to store the response chunks
      res.on('data', (d) => { body += d; }); // store each response chunk
      res.on('end', () => {
        // After all the data has been received parse the JSON for desired data
        let response = JSON.parse(body);
        let forecast = response['data']['weather'][0];
        let location = response['data']['request'][0];
        let conditions = response['data']['current_condition'][0];
        let currentConditions = conditions['weatherDesc'][0]['value'];
        // Create response
        let output = `Current conditions in the ${location['type']}   
        ${location['query']} are ${currentConditions} with a projected high of
        ${forecast['maxtempC']}°C or ${forecast['maxtempF']}°F and a low of 
        ${forecast['mintempC']}°C or ${forecast['mintempF']}°F on 
        ${forecast['date']}.`;
        // Resolve the promise with the output text
        console.log(output);
        resolve(output);
      });
      res.on('error', (error) => {
        reject(error);
      });
    });
  });
}


//UBIDOTS--MAJOR API--WEBHOOK.
function callUbidotsApi(location,device,state,fanSpeed) {
  return new Promise((resolve, reject) =>{
    http.get("http://things.ubidots.com/api/v1.6/variables?token=A1E-v8eYHn72rYMlAHfc1PsfOh87HFQnyB", (res) => {
      console.log("Status"+res.statusCode);
    });
    var notFan=0;
    var opState;
    device=device.replace(/s/g,'');
    if(location == "kitchen"){
      if(device=="fan")
        notFan=1;       // our kitchen doesn't have a fan!
      else
        device = "kitchen_"+device;
    }

    else{
      if(device=="fan")
        device = "bedroom_"+device+"_speed"; //only fan has non boolean type values (ie, it's not just on/off, it has medium, high and lo too)
      else
        device = "bedroom_"+device;
    }

    var json={};
    if(device=="bedroom_fan_speed")
      json[device]=fanSpeed; //assigning the fan state as requested by user.
    else
      json[device] = state;

    if(state==0)
      opState="off";
    else
      opState="on";

      // the regular http post protocol.
      http.post('http://things.ubidots.com/api/v1.6/devices/TEST/?token=A1E-v8eYHn72rYMlAHfc1PsfOh87HFQnyB', json, function(res){
        res.setEncoding('utf8');
        let body = '';
        res.on('data', (d) => { body += d; });
        res.on('end', () => {
          let response = JSON.parse(body);
          console.log(response);
          let output = "Device switched "+opState+" successfully \n The status code is:"+res.statusCode;
          console.log(output);
          resolve(output);
        });
        res.on('error', (error) => {
          reject(error);
        });
      });
  });
}