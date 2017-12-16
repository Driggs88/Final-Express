const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    commenter: { type: Schema.Types.ObjectId },
    commentText: { type: String },
  }
);

const Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;
