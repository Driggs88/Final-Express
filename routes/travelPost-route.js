const express = require('express');
const router  = express.Router();
const multer    = require('multer');
const passport = require("passport");
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');
const upload = multer({ dest: 'public/uploads/' });
const TravelPost = require('../models/travelPost-model');

router.get('/post/new', ensureLoggedIn(), (req, res) => {
    res.render('post/newpost', { types: TYPES });
});

router.post('/post/new', ensureLoggedIn(), upload.single('photo'), (req, res) => {

    const post = new TravelPost ({
      _creator: req.user._id,
      title: req.body.title,
      description: req.body.description,
      travelPhotos: `/uploads/${req.file.filename}`,
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
