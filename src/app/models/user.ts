'use strict';

import * as mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
    username: string;
    name: string;
    email: string;
    password: string;
}

export const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please fill a valid email address'
        ]
    },
    password: {
        type: String,
        required: true
    }
});

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
