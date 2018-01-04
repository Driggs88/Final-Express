const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

const UserModel = require('../models/user-model');


// Save the user's ID in the bowl (called when user logs in)
  passport.serializeUser((userFromDb, next) => {
    next(null, userFromDb._id);
  });


// Retrieve full user details from DB using id saved in the bowl
  passport.deserializeUser((idFromBowl, next) => {
    UserModel.findById(
      idFromBowl,
      (err, userFromDb) => {
      if (err) {
        next(err);
        return
      }

      next(null, userFromDb);
    }
  );
});
