const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const travelPostSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    likes: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    },
    //array of user id that liked the post
    likedUsers: {
      type: Array,
      default: []
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User' // "ref" is the string name of a model that the ID refers to
    },            // you NEED "ref" to use "populate()"
    travelPhotos: { type: String }
  },
  location: { type: String},
  {
    timestamps: true
  }
);  

  // travelPostSchema.methods.belongsTo = function(user){
  //   return this._creator.equals(user._id);
  // }

const TravelPost = mongoose.model("TravelPost", travelPostSchema);

module.exports = TravelPost;
