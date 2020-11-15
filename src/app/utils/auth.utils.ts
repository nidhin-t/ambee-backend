'use strict';

const path = require('path'),
    fs = require('fs');

const jwt = require('jsonwebtoken');

let config = require('../../config/config');

let privateKEY = fs.readFileSync(
    path.join(__dirname, '../../../creds/jwtRS512.key'),
    'utf8'
);
// publicKEY = fs.readFileSync(
//     path.join(__dirname, '../../../creds/jwtRS512.key.pub'),
//     'utf8'
// );

export const signJWT = function (payload) {
    let $Options = {
        issuer: 'Ambee Authorization server',
        subject: 'contact@example.com',
        audience: 'Client_Identity' // this should be provided by client
    };

    // Token signing options
    let signOptions = {
        issuer: $Options.issuer || config.jwt.issuer,
        expiresIn: '30d', // 30 days validity
        algorithm: 'HS512', //* we can also use RS512 with public and private key
        subject: $Options.subject || undefined,
        audience: $Options.audience || undefined
    };

    return jwt.sign(payload, privateKEY, signOptions);
};

export const verifyJWT = function (token) {
    let $Options = {
        issuer: 'Ambee Authorization server',
        subject: 'contact@example.com',
        audience: 'Client_Identity' // this should be provided by client
    };

    let verifyOptions = {
        issuer: $Options.issuer || config.jwt.issuer,
        subject: $Options.subject || undefined,
        audience: $Options.audience || undefined,
        expiresIn: '30d',
        algorithm: ['HS512']
    };

    try {
        return jwt.verify(token, privateKEY, verifyOptions);
    } catch (err) {
        console.log('error validating token');
        return false;
    }
};

export const decodeJWT = function (token) {
    return jwt.decode(token, { complete: true });
    // returns null if token is invalid
};
