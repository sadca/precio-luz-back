import Server from './server/server';

const env = require('node-env-file');
const path = require('path');

env(path.resolve(__dirname + '/.env'));

require('./config/config');

const port = Number(process.env.PORT) || 0;
const server = Server.init(port);

import router from './routes/router';
server.app.use(router);
import mails from './routes/mails';
server.app.use('/mails', mails);
import auth from './routes/auth';
server.app.use('/auth', auth);
import costs from './routes/costs';
server.app.use('/costs', costs);

// import fileUpload = require('express-fileupload');
// server.app.use(fileUpload());

server.start(() => {
  console.log('Servidor corriendo en el puerto', port);
});
