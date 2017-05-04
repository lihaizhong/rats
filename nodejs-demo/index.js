/**
 * Created by sky on 2017/5/3.
 */

const serve = require('./server');
const router = require('./router');
const requestHandlers = require('./requestHandlers');

var handle = {};

handle['/start'] = handle['/'] = requestHandlers.start;
handle['/upload'] = requestHandlers.upload;
handle['/show'] = requestHandlers.show;

serve.start(router.route, handle, 8080);

