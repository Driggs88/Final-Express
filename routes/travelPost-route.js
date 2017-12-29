const express = require('express');
const multer = require('multer');


const TravelPost = require('../models/travelPost-model');

const router  = express.Router();

const myUpload = multer({
  dest: __dirname + '/../public/uploads/' });


router.post('/api/travelPost', myUpload.single('travelPhoto'), (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ message: 'Log in to make a travel post' });
    return;
  }

    const theTravelPost = new TravelPostModel ({
      title: req.body.postTitle,
      description: req.body.postDescription,
      likes: req.body.postLikes,
      user: req.user._id
    })
    post.save((err, newpost) => {
      if (err) {
        res.render('post/newpost', { TravelPost: newpost, types: TYPES });
      } else {
        res.redirect('/');
      }
    });
});

// routes to Edit post
router.get('/:id/edit', ensureLoggedIn('/login'),  (req, res, next) => {
  TravelPost.findById(req.params.id, (err, post) => {
    if (err)       { return next(err) }
    if (!post) { return next(new Error("404")) }
    return res.render('post/edit', { post, types: TYPES })
  });
});


// Find and Update record
router.post('/:id/edit', ensureLoggedIn('/login'), (req, res, next) => {
  const updates = {
    title: req.body.title,
    description: req.body.description,
  };

  TravelPost.findByIdAndUpdate(req.params.id, updates, (err, post) => {
    if (err) {
      return res.render('post/edit', {
        post,
        errors: post.errors
      });
    }
    if (!post) {
      return next(new Error('404'));
    }
    return res.redirect(`/`);
  });
});
router.post('/:id/delete', (req, res, next) => {
  TravelPost.findByIdAndRemove(req.params.id, (err, post) => {
    if (err) {
      return next(err);
    }
    return res.redirect('/');
  })
})

module.exports = router;
