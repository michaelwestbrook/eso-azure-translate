'use strict';

const https = jest.genMockFromModule('https');
let dataCallback, endCallback, errorCallback;
function request(params, callback) {
  callback({
    on: on
  });

  return {
    write: write,
    end: () => {}
  }
}

function on(event, callback) {
  switch (event) {
    case "data":
      dataCallback = callback;
      break;
    case "end":
      endCallback = callback;
      break;
    case "error":
      errorCallback = callback
      break;
    default:
      break;
  }
}

function write(data) {
  dataCallback("[{\"translations\": [{\"to\": \"fr\", \"text\": \"French!\"}, {\"to\": \"de\", \"text\": \"German!\"}]}]");
  endCallback();
}

https.request = request;
module.exports = https;