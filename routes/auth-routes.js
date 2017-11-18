const express = require('express');
const bcrypt     = require('bcrypt');

const User = require('../models/user-model');


const router = express.Router();

router.post('/signup', (req, res, next) => {
                            // reference name from the form
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
    })
        theUser.save((err) => {
            if (err) {
              res.status(500).json({ message:  'Something went wrong' });
              return;
            }
            req.login(theUser, (err) => {
                res.status(200).json(theUser);
        });
     });
  });
});

router.post('/login', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ username: username}, (err, foundUser) =>{
    if (foundUser === null) {
        res.status(400).json({ message: 'Incorrect username'});
        return;
    }
    if (!bcrypt.compareSync(password, foundUser.password)) {
      res.status(400).json({ message: 'Incorrect password'});
      return;
    }
    req.login(foundUser, (err) => {
        res.status(200).json(foundUser);
    });
  })
})



module.exports = router;
