require('dotenv').config();

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'production';
}

const mongoose = require('mongoose');

import { config } from './config/config';

// Init the express application
let app = require('./config/express')();

process.on('uncaughtException', function (err) {
    console.log('Error:', err);
});

// * Connect the MongoDB first
mongoose
    .connect(config.db.MONOGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        // Start the app by listening on <port>
        app.get('server').listen(config.port);
        // Logging initialization
        console.log(
            `${config.app.title} started on ${config.hostname} : ${
                config.port
            } in ${
                process.env.NODE_ENV
            } mode on ${new Date().toISOString()} | MongoDb Cloud Connected`
        );
    })
    .catch((error) => {
        console.log(error);
    });

// Expose app
exports = module.exports = app;
