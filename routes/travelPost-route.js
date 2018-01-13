const express = require('express');
const multer = require('multer');
const mongoose     = require('mongoose');




const TravelPost = require('../models/travelPost-model');

const router  = express.Router();

const myUpload = multer({
  dest: __dirname + '/../public/uploads/' });


router.post('/api/travelPost', myUpload.single('travelPicture'), (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ message: 'Log in to make a travel post' });
    return;
  }

    const theTravelPost = new TravelPost ({
      title: req.body.travelTitle,
      description: req.body.travelDescription,
      likes: req.body.postLikes,
      user: req.user._id
    });

    if (req.file) {
      theTravelPost.travelPhotos = '/uploads/' + req.file.filename;
    }

    theTravelPost.save((err) => {
      // Unknow error from the database
      if (err && theTravelPost.errors === undefined) {
        res.status(500).json({ message: 'Travel post did not save' });
        return;
      }

      // // Validation error
      // if (err && theTravelPost.errors) {
      //   res.status(400).json({
      //     titleError: theTravelPost.error.title,
      //     descriptionError: theTravelPost.error.description
      //   });
      //   return;
      // }

      req.user.encryptedPassword = undefined;
      theTravelPost.user = req.user;

      res.status(200).json(theTravelPost);
    });
});

// routes to Edit post
router.get('/api/travelPost', (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ message: 'Log in to see Post.' });
    return;
  }

  TravelPost
    .find()

    // Retrives all the info of the owners
    .populate('user', { encryptedPassword: 0 })

    .exec((err, allTheTravelPost) => {
      if (err) {
        res.status(500).json({ message: 'Failed to edit post' });
        return;
      }
      console.log(allTheTravelPost);
      res.status(200).json(allTheTravelPost);
    });
});


// // Find and Update record
// router.post('/:id/edit', ensureLoggedIn('/login'), (req, res, next) => {
//   const updates = {
//     title: req.body.title,
//     description: req.body.description,
//   };
//
//   TravelPost.findByIdAndUpdate(req.params.id, updates, (err, post) => {
//     if (err) {
//       return res.render('post/edit', {
//         post,
//         errors: post.errors
//       });
//     }
//     if (!post) {
//       return next(new Error('404'));
//     }
//     return res.redirect(`/`);
//   });
// });
router.delete('/api/travelPost/:id', (req, res) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  TravelPost.remove({ _id: req.params.id }, (err) => {
    if (err) {
      res.json(err);
      return;
    }

    return res.json({
      message: 'Travel post has been deleted!'
    });
  })
});

module.exports = router;
