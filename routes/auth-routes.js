const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const multer    = require('multer');
const upload = multer({ dest: 'public/uploads/' });


const UserModel = require('../models/user-model');


const authRouter = express.Router();


authRouter.post('/api/signup', (req, res, next) => {
  if (!req.body.signupEmail || !req.body.signupPassword) {
    // 400 for client errors
    res.status(400).json({ message: 'Need both email and password'});
    return;
  }

UserModel.findOne(
    { email: req.body.signupEmail },
    (err, userFromDb) => {
      if (err) {
        res.status(500).json({ message: 'Email check failed'});
        return;
      }

      if (userFromDb) {
        // 400 for client errors
        res.status(400).json({ message: 'Email already exists!' });
        return;
      }

      const salt = bcrypt.genSaltSync(10);
      const scramblePassword = bcrypt.hashSync(req.body.signupPassword, salt);

      const theUser = new UserModel ({
        fullName: req.body.signupFullName,
        email: req.body.signupEmail,
        encryptedPassword: scramblePassword
      });

      theUser.save((err) => {
        if (err) {
          res.status(500).json( { message: 'User cannot be saved'});
          return;
        }

        // Automatically logs user in after the sign up
        // (req.login() is defined by passport)
        req.login(theUser, (err) => {
          if (err) {
            res.status(500).json({ message: 'Login failed'});
            return;
          }
          // Clears encryptedPassword before sending from the object not database
          theUser.encryptedPassword = undefined;

          // Send the user's info to the frontend
          res.status(200).json(theUser);
        }); // close req.login()
      }); //close theUser.save()
    }
  ); // close UserModel.findOne()
}); // close authRouter.post('/signup')


authRouter.post('/api/login', (req, res, next) => {
    const authenticateFunction  =
      passport.authenticate('local', (err, theUser, extraInfo) => {
        // Errors prevented us from deciding if login was a success or failure
        if (err) {
          res.status(500).json({ message: 'Unknow login error' });
          return;
        }

        // Login failed if theUser is empty
        console.log('MY USER = ', theUser);
        if (!theUser) {
          // "extraInfo" contains feedback message from LocalStrategy
          res.status(401).json(extraInfo);
          return;
        }

        // Login successful, save them in the session
        req.login(theUser, (err) => {
          if (err) {
            res.status(500).json({ message: 'Session failed to save'});
            return;
          }

          // Clears encryptedPassword before sending from the object not database
          theUser.encryptedPassword = undefined;

          // Everything worked! Send the user's info to the client
          res.status(200).json(theUser);
        });
      });

    authenticateFunction(req, res, next);
});


authRouter.post('/api/logout', (req, res, next) => {
  // req.logout() is defined by passport
  req.logout();
  res.status(200).json({message: 'Log out success!'});
});


authRouter.get('/api/checklogin', (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ message: 'User is not logged in' });
    return;
  }

  // Clears encryptedPassword before sending from the object not database
  req.user.encryptedPassword = undefined;

  res.status(200).json(req.user);
});


module.exports = authRouter;
