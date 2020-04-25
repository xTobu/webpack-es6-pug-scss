const liveServer = require('live-server');

const options = {
    port: 1234,
    host: '0.0.0.0',
    root: './dist/',
    open: false,
    wait: 1000,
};

liveServer.start(options);
