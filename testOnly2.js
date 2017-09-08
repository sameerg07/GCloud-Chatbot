var http = require('http');
http.post = require('http-post');

function callUbidotsApi(location,device,state) 
{
	return new Promise((resolve, reject) =>{
		http.get("http://things.ubidots.com/api/v1.6/variables?token=A1E-v8eYHn72rYMlAHfc1PsfOh87HFQnyB", (res) => {
		  console.log("Status"+res.statusCode);
		});
		var json={};
		json[device] = state;
		console.log(json,typeof(device));
			http.post('http://things.ubidots.com/api/v1.6/devices/TEST/?token=A1E-v8eYHn72rYMlAHfc1PsfOh87HFQnyB', json, function(res){
				res.setEncoding('utf8');
				let body = '';
				res.on('data', (d) => { body += d; });
				res.on('end', () => {
					let response = JSON.parse(body);
					console.log(response);
					let output = res.statusCode;
					console.log(output);
	    			resolve(output);
	      
				});
      			
      			res.on('error', (error) => {
        		reject(error);
      		});
		});
	});
}

callUbidotsApi("Bedroom","value1",1234);