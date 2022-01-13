import pkg from 'passport-jwt';
import mongoose from 'mongoose';
import User from '../models/userSchema.js';
import dotenv from 'dotenv';
import passport from 'passport';

dotenv.config()
const opts = {};
const {ExtractJwt} = pkg;
const {Strategy : JwtStrategy} = pkg;
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SecretNumber;

let passport2 = () =>{
  passport.use(
    new JwtStrategy(opts , (jwt_payload , done)=>{
      User.findById(jwt_payload._id).then((user)=>{
        if(user){
          return done(null , user)
        }
        return done(null , false)
      }).catch((err) => console.log(err))
    }));
};

export default passport2;