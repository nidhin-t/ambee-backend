const bcrypt = require('bcrypt');

let config = require('../../config/config');
import User from '../models/user';

import { log } from '../utils/error.utils';

import { signJWT, verifyJWT } from '../utils/auth.utils';

/**
 * AUTHENTICATION MIDDLEWARE FUNCTION
 */
export const authenticate = function (req, res, next) {
    if (req.headers.authorization === config.authorization) {
        next();
    } else {
        return res.status(400).jsonp({
            message:
                'You may be unauthorized to do this request! Please add the token'
        });
    }
};

/**
 * Resolve JWT Token Middleware to find the User info
 * @param req
 * @param res
 * @param next
 */
export const resolveToken = (req, res, next) => {
    let token = req.headers.authorization.split(' ')[1];
    let decodedToken = verifyJWT(token);

    if (!decodedToken) {
        return res.status(401).send({
            message: 'Invalid access. Sign in / validate your token'
        });
    }
    req.headers.secret = decodedToken;
    next();
};

/**
 * Resolve JWT Secret to identify access rights
 * @param req
 * @param res
 * @param next
 */
export const resolveSecret = async (req, res, next) => {
    let secret = req.headers.secret;

    let validUser = await User.findOne({ username: secret.username });
    if (!validUser) {
        log('info', {
            message: 'Non vefified User'
        });
        return res.status(401).send({ message: 'Invalid access.' });
    }
    next();
};

/**
 * Generate JWT API Credentials after signing - Token & Secret
 * @param req
 * @param res
 */
export const generateAPICredentials = function (req, res) {
    // When generating do a check to see if the user is allowed to have access to the API

    let shouldAllow = true;

    if (shouldAllow) {
        let token = signJWT(req.body);

        // Secret generation should be done for every tenant
        // Once generated, secret can be stored/retrieved from DB

        return res.status(200).jsonp({
            token: token
        });
    }

    return res.status(500).jsonp({
        error: 'Cannot read end point credentials'
    });
};

export const createUser = async (req, res) => {
    let username = req.body.username;
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;

    let userDoc = await User.findOne({
        $or: [{ username: username }, { email: email }]
    });
    try {
        if (userDoc) {
            return res.status(403).jsonp({
                error:
                    'E-Mail or Username exists already, please pick a different one.'
            });
        }
        let hashedPassword = await bcrypt.hash(password, 12);
        let newUser = new User({
            username: username,
            name: name,
            email: email,
            password: hashedPassword
        });
        let result: any = await newUser.save();
        return res.status(201).json({
            message: 'User created',
            username: result.username
        });
    } catch (err) {
        console.log('error creating user', err);
        log('info', {
            message: err
        });
        return res.status(500).jsonp({ message: 'User Not created' });
    }
};

export const authenticateUser = (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    return User.findOne({ username: username })
        .then((validUser) => {
            if (!validUser) {
                log('info', {
                    message: 'Invalid username!'
                });
                return res.status(401).jsonp({ message: 'Invalid username!' });
            }
            console.log('user details', password, validUser.password);
            return bcrypt.compare(password, validUser.password);
        })
        .then((correctPassword) => {
            if (!correctPassword) {
                log('info', {
                    message: 'Invalid username!'
                });
                return res.status(401).jsonp({ message: 'Invalid Password!' });
            }
            let token = signJWT({ username: username });
            console.log('token generated', token);
            return res.status(200).jsonp({
                token: token,
                message: 'User Authenticated!'
            });
        })
        .catch((err) => {
            console.log('error logging in>', err);
            log('error', {
                message: err
            });
            return res.status(500).jsonp({ message: 'User not logged in!' });
        });
};
