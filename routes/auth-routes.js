const express = require('express');
const bcrypt     = require('bcrypt');

const User = require('../models/user-model');


const router = express.Router();

router.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    res.status(400).json({ message: 'Provide username and password' });
    return;
  }
  //see if username is already taken
  User.findOne({ username: username}, '_id', (err, foundUser) => {
    if (foundUser) {
      res.status(400).json({ message: 'The username already exist'});
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);

    const theUser = new User({
      username: username,
      password: hashPass,
    }),
    theUser.save((err) => {
      
    });
  });
});




module.exports = router;
