'use strict';

// Derived from template: https://docs.microsoft.com/en-us/azure/cognitive-services/Translator/quickstart-nodejs-translate
const https = require('https');

const host = 'api.cognitive.microsofttranslator.com';
const path = '/translate?api-version=3.0';

const get_guid = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

const Translate = function (subscriptionKey, content) {
    // Translate to German and Italian.
    let params = `&from=en&to=fr&to=de&textType=html`;
    let request_params = {
        method: 'POST',
        hostname: host,
        path: path + params,
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': subscriptionKey,
            'X-ClientTraceId': get_guid(),
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(request_params, function (response) {
            let body = '';
            response.on('data', function (d) {
                body += d;
            });
            response.on('end', function () {
                resolve(body);
            });
            response.on('error', function (e) {
                console.log('Error: ' + e.message);
                reject(e);
            });
        });
        req.write(content);
        req.end();
    });
}

module.exports = (subscriptionKey, text) => Translate(subscriptionKey, JSON.stringify([{ 'Text': text }]));