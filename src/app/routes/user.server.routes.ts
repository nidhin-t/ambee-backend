'use strict';

import {
    createUser,
    authenticateUser
} from '../controllers/auth.server.controller';

module.exports = function (app) {
    app.route('api/signup').post(createUser);
    app.route('api/login').post(authenticateUser);
};
