# Contributors:
* Prasanna V : https://github.com/Prassi07
* Sameer G : https://github.com/sameerg07
* Rahul RB : https://github.com/Rahul-RB
# Project Aim and Motivation:

## Motivation : Our motivation drives towards increased mobile accesibility especially for disabled people (our priority).

## Aim: As described above, develop an IoT system, where you can switch on your home appliances (light and fans in this hackathon), from a written command / text command from your mobile/desktop (cross platform).

#### Why implement another home automation system, when thousands of smaller and potentially faster ones exist? -- The home automation systems existing these days are no doubt good, but they lack the following features:

* costly (even a small switch costs rs 1000 + , due to redundant wifi modules in each switch).
* Not expandable.
* Not serviceable easily.
* Our alternative to the existing ones is to overcome the difficulties mentioned above.

## Project Structure:

* jarvis.html --> open this, type commands like :" Switch [on/off] [kitchen/bedroom] [light/fan]", or any combination of that in valid grammar. -- Please refer the note at starting. We regret inconvinience.

* index.js --> backend for the AI service, please visit our team bench for live demo.

* package.json --> no need to see through, it has all the packet dependencies for node.

* index.js accesses two apis: 
  - weather api from worldweatheronline.com 
  - A custom API built by us, on api.ai, named "UbiDotsAPI". This API, connects to UbiDots, another IOT cloud to connect to NodeMCU. 
  - Outputs in promise js. NOTE: index.js is a node run file. Runs on gcloud by using buckets. $gcloud beta functions deploy ubiDotsAndWeather --stage-bucket jarvisapiai --trigger-http

  -kairos files -- are working test files for facial recognition.

## Please ignore other files, they are test files.
