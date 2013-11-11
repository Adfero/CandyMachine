var serialport = require('serialport');
var http = require('http');
var config = require('./config.json');

var serialPort = null;

function reconnect() {
  if (serialPort) {
    serialPort.close();
  }

  serialPort = new serialport.SerialPort(config.device, {
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

      console.log('data: "' + payload + '"');

      var req = http.request({
        host: config.server.host,
        port: config.server.port,
        path: config.server.path,
        method: 'PUT',
        headers: {
          'Content-length': payload.length,
          'Content-type': 'application/json'
        }
      },function(res) {
        console.log('Logged "' + payload + '"');
      });

      req.on('error', function(e) {
        console.log(e);
      });
      
      req.write(payload);
      req.end();
    });
  });
}

reconnect();