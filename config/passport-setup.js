const passport = require('passport');
const User = require('../models/user-model.js');


//SerializeUser: is saving only the ID in the session
  passport.serializeUser((loginUser, cb) => {
    cb(null, loginUser._id);
  });


//retrieve full user details from DB using id, where all info is stored during session
  passport.deserializeUser((userIdFromSession, cb) => {
    User.findById(userIdFromSession, (err, userDocument) => {
      if (err) {
        cb(err);
        return
      }
      cb(null, userDocument);
    });
  });
