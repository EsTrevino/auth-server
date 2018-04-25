const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

//create local Strategy
const localOptions = {usernameField: 'email'}
const localLogin = new LocalStrategy(localOptions, function(email, password, done){
  //verify this username and password
  User.findOne({email: email}, function(err, user){
    if(err) {return done(err);}
    if(!user) {return done(null, false);}

    //compare passwords is 'password' equal to user.password?
    user.comparePassword(password, function(err, isMatch){
      if(err){ return done(err);}
      if(!isMatch) { return done(null, false);}

      return done(null, user);
    })

  })
  //if it is the correct username and password
  //otherwise, call done with false
})

//set up options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

//create strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){
  //see if the user  ID in the payload exists in our database
  //if it does, call 'done' with the 'done' callback
  //otherwise, call done without a user object
  User.findById(payload.sub, function(err,user) {
    if(err) {return done(err, false);}

    if(user){
      done(null, user);
    }else{
      done(null, false);
    }
  })

});

//tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);