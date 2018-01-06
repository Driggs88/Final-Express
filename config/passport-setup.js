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


passport.use(new LocalStrategy (
  {
    usernameField: 'enterEmail',
    passwordField: 'enterPassword'
  },
  (theEmail, thePassword, next) => {

      UserModel.findOne(
        { email: theEmail },
        (err, userFromDb) => {
          if (err) {
            next(err);
            return;
          }

          if (userFromDb === null) {
            next(null, false, { message: 'Incorrect email' });
            return;
          }

          if (bcrypt.compareSync(thePassword, userFromDb.encryptedPassword) === false) {
            next(null, false, { message: 'Incorrect password' });
            return;
          }

          next(null, userFromDb);
        }
      );
  }
));
