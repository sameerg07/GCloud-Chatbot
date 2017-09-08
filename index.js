'use strict';
var http = require('http');
http.post = require('http-post');

const host = 'api.worldweatheronline.com';
const wwoApiKey = '55b43550d8ad4d0fa78131934170609';


exports.ubiDotsAndWeather = (req, res) => {
  //----------------------------------WEATHER FUNCTIONS START-----------------------------------//
  // Get the city and date from the request
  // let city = req.body.result.parameters['geo-city']; // city is a required param
  // // Get the date for the weather forecast (if present)
  // let date = '';
  // if (req.body.result.parameters['date']) {
  //   date = req.body.result.parameters['date'];
  //   console.log('Date: ' + date);
  // }
  // // Call the weather API
  // callWeatherApi(city, date).then((output) => {
  //   // Return the results of the weather API to API.AI
  //   res.setHeader('Content-Type', 'application/json');
  //   res.send(JSON.stringify({ 'speech': output, 'displayText': output }));
  // }).catch((error) => {
  //   // If there is an error let the user know
  //   res.setHeader('Content-Type', 'application/json');
  //   res.send(JSON.stringify({ 'speech': error, 'displayText': error }));
  // });
  //---------------------------------WEATHER FUNCTIONS END-----------------------------------//

  //---------------------------------UBIDOTS FUNCTIONS START---------------------------------//
  let objectName = req.body.result.parameters['object_name']; 
  let objectLocation = req.body.result.parameters['object_location']; 
  let switchState = req.body.result.parameters['switch_state'];

  console.log(objectLocation,objectName,switchState);

  // Call the weather API
  callUbidotsApi(objectLocation,objectName,switchState).then((output) => {
    // Return the results of the weather API to API.AI
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ 'speech': output, 'displayText': output }));
  }).catch((error) => {
    // If there is an error let the user know
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ 'speech': error, 'displayText': error }));
  });  
  //---------------------------------UBIDOTS FUNCTIONS END-----------------------------------//

};


//toggleSwitchState(Device,State) --
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

function callUbidotsApi(location,device,state) {
	return new Promise((resolve, reject) =>{
		http.get("http://things.ubidots.com/api/v1.6/variables?token=A1E-v8eYHn72rYMlAHfc1PsfOh87HFQnyB", (res) => {
		  console.log("Status"+res.statusCode);
		});
		var json={};
		json[device] = state;
		console.log(json,typeof(device));
			http.post('http://things.ubidots.com/api/v1.6/devices/TEST/?token=A1E-v8eYHn72rYMlAHfc1PsfOh87HFQnyB', json, function(res){
			 res.setEncoding('utf8');
			 // console.log(res.statusCode);
       
		});
      res.on('error', (error) => {
        reject(error);
      });
	});
}
