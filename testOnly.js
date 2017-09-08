'use strict';
var http = require('http');
http.post = require('http-post');
const host = 'things.ubidots.com';
const wwoApiKey = 'A1E-v8eYHn72rYMlAHfc1PsfOh87HFQnyB';

function callUbidotsApi(location,device,state) {
 return new Promise((resolve, reject) =>{
		http.get("http://things.ubidots.com/api/v1.6/variables?token=A1E-v8eYHn72rYMlAHfc1PsfOh87HFQnyB", (res) => {
			console.log("Status"+res.statusCode);
		});
		var json={};
		json[device] = state;
		console.log(json);
		// json.push(json);
		console.log(json,typeof(device));
		http.post('http://things.ubidots.com/api/v1.6/devices/TEST/?token=A1E-v8eYHn72rYMlAHfc1PsfOh87HFQnyB', json, function(res){
	 		res.setEncoding('utf8');
	 		console.log(res.statusCode);
	 	});
	});
}

// ubiVerify();
callUbidotsApi("bedroom","value1",1672);
// .then((output) => {
//   // Return the results of the weather API to API.AI
//   res.setHeader('Content-Type', 'application/json');
//   res.send(JSON.stringify({ 'speech': output, 'displayText': output }));
// }).catch((error) => {
//   // If there is an error let the user know
//   res.setHeader('Content-Type', 'application/json');
//   res.send(JSON.stringify({ 'speech': error, 'displayText': error }));
// });
