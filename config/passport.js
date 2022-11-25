import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/user.js';
import passport from 'passport';
import bcrypt from 'bcrypt-nodejs';

export default (passport) => {

    passport.serializeUser((user,done) =>{
        done(null,user.id);
    })
    
    passport.deserializeUser((id,done)=> {
        User.findById(id,(err,user)=> {
            done(err,user)
        })
    })
    
    passport.use(
        new LocalStrategy((username,password,done)=>{
            User.findOne({username:username},(err,user) =>{
                if (err) throw err;
                if(!user) return done(null,false);
                bcrypt.compare(password,user.password,(err,result) => {
                    if (err) throw err;
                    if(result === true){
                        return done(null,user);
                    }
                    else {
                        return done(null,false);
                    }
                })
            })
        })
    )
}


