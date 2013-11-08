var serialport = require('serialport');
var http = require('http');
var config = require('./config.json');

var serialPort = new serialport.SerialPort(config.device, {
  baudrate: 9600,
  // dataBits: 8, 
  // parity: 'none', 
  // stopBits: 1, 
  // flowControl: false ,
  parser: serialport.parsers.readline("\n") 
});

serialPort.on('open', function () {
  console.log('open');
  serialPort.on('data', function(data) {
    var safeData = data.replace('\r','').replace('\n','');
    var payload = JSON.stringify({data:safeData});

    var req = http.request({
      host: config.server.host,
      port: config.server.port,
      path: config.server.path,
      method: 'PUT',
      headers: {
        'Content-length': payload.length
      }
    },function(res) {
      console.log('Logged "' + data + '"');
    });
    req.on('error', function(e) {
      console.log('problem with request: ' + e.message);
    });
    
    req.setHeader('Content-type','application/json');
    req.write(payload);
    req.end();
  });
});