'use strict';

import {
    resolveToken,
    resolveSecret
} from '../controllers/auth.server.controller';
import { insertAQI } from '../controllers/aqi.server.controller';

module.exports = function (app) {
    app.route('json/aq-index').post(resolveToken, resolveSecret, insertAQI);
};
