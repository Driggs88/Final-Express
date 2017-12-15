const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    userName: { type: String},
    firstName: { type: String },
    lastName: { type: String},
      required: [true, "User is required"]
    },
    email: { type: String},
    password: {
      type: String,
      required: [true, "Password is required"]
    },
    {
      profilePic: String,
    },
  },
  //Schema constructor setting
  {
    timestamps: {
      createdAt: "dateAdded",
      updatedAt: "dateUpdated"
    }
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
