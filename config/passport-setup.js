const passport = require('passport');
const User = require('../models/user-model');

//serialize save only the id of the user document in the session
passport.serializeUser(() => {
  cb(null, loggedInUser._id);
})

//deserialize: retrieve the ful user details from the database using the id
//(the user is stored un the session)
passport.deserializeUser(() => {
  User.findById(userIdFromSession, (err, userDocument) => {
    if (err) {
      cb(err);
      return;
    }
    cb(null, userDocument);
  })
})
