const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');


const travelPostSchema = new Schema(
  {
    _creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    likes: { type: Number },
    //array of user id that liked the post
    users: [],
    travelPhotos: { type: String},
    location: { type: String},
  });

  requestJobSchema.virtual('inputFormattedDate').get(function(){
    return moment(this.deadline).format('YYYY-MM-DD');
  });

  requestJobSchema.methods.belongsTo = function(user){
    return this._creator.equals(user._id);
  }  


const TravelPost = mongoose.model("TravelPost", travelPostSchema);
module.exports = TravelPost;
