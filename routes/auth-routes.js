const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user-model');

const router = express.Router();

router.post('/signup', (req, res, next) =>{
  const username = req.body.username;
  const password = req.body.password;

 if(!username || !password) {
    res.status(400).json({message: 'Provide username and password'});
    return;
  }
    //see if the username is already taken (query the database)
    User.findOne({ username: username }, '_id', (err, foundUser)=>{
    if(foundUser) {
      res.status(400).json({message: 'The username alread exists mothafucka'});
      return;
    }
    //save to the DB if we didn't find the user
    const salt = bcrypt.genSaltSync(10);
    const hashPass= bcrypt.hashSync(password, salt);
    const theUser = new User({
      username: username,
      password: hashPass
    })
    theUser.save((err) => {
        if(err) {
            res.stataus(500).json({message: 'Something went wrong'});
        }
        req.login(theUser, (err) => {
          theUser.password = undefined;
          res.status(200).json(theUser);
        })//LOGIN
    });//User.Save
  });//User.findOne
});//GET SIGNUP ROUTE

 router.post('/login', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

   //see if the username credential is valid
    User.findOne({ username: username}, (err, foundUser) => {
      //send an error if no user with that username
      if(!foundUser) {
          res.status(400).json({message: 'Incorrect Username'});
          return;
      }
      if(!bcrypt.compareSync(password, foundUser.password)){
        res.status(400).json({message: "Incorrect password!"});
        return;
      }
      //if we get here we are GOOD!
      //log the user in
      req.login(foundUser, (err) => {
        //hide the password from the frontend by setting it to undefined
        foundUser.password = undefined;
        res.status(200).json(foundUser);
      });
      //send an error if password
    })//User.findOne()
  }) //POST/login

router.post('/logout', (req, res, next) => {
  req.logout();
  res.status(200).json({message: 'Success'});
});

router.get('/loggedin', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
    return;
  }
  res.status(403).json({message: 'Unauthorized'})
});

router.get('/private', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.status(200).json({message: 'This is a private message'})
    return;
  }
  res.status(403).json({message: 'Unauthorized'})
});


module.exports = router;
