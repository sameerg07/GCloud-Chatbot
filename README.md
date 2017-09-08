Project Structure: 
  - index.js --> backend for the AI service, please visit our team bench for live demo.
  - package.json --> no need to see through, it has all the packet dependencies for node.
  
index.js accesses two apis:
a. weather api from worldweatheronline.com
b. A custom API built by us, on api.ai, named "UbiDotsAPI". This API, connects to UbiDots, another IOT cloud to connect to NodeMCU.
c. Outputs in promise js.
NOTE:
  index.js is a node run file. Runs on gcloud by using buckets. 
  $gcloud beta functions deploy ubiDotsAndWeather --stage-bucket jarvisapiai --trigger-http

Please ignore other files, they are test files.
