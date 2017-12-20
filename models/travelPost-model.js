const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');
const moment = require('moment');


const travelPostSchema = new Schema(
  {
    _creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    likes: { type: Number },
    //array of user id that liked the post
    likedUsers: { type: Array, default: [] },
    // likeUsers:[{type: Schema.Types.ObjectId,  'default': [], ref: 'Likes'}],
    travelPhotos: { type: String},
    location: { type: String},
  });

  travelPostSchema.methods.belongsTo = function(user){
    return this._creator.equals(user._id);
  }

const TravelPost = mongoose.model("TravelPost", travelPostSchema);
module.exports = TravelPost;
