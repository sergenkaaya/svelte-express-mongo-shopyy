import mongoose from 'mongoose';
//import bcrypt from 'bcrypt-nodejs';
const Schema = mongoose.Schema;
//import passportLocalMongoose from 'passport-local-mongoose';
//import { UserExistsError } from 'passport-local-mongoose/lib/errors';

const userSchema = Schema({
    username:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
});

let user = mongoose.model("User", userSchema);

export default user;
