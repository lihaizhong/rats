/**
 * Created by sky on 2017/5/3.
 */

const http = require('http');
const url = require('url');

function start(route, handle, port) {

    port || (port = 3000);

    http.createServer((request, response) => {
            let pathname = url.parse(request.url).pathname;
            console.log('Request for ' + pathname + ' receiced.');

            route(handle, pathname, request, response);
        })
        .listen(port);

    console.log('Server has started! Listen to port: ' + port);
}

exports.start = start;

