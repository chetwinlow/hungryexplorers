const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const postSchema = mongoose.Schema({
  photo: {
    type: Buffer,
    required: false
  },
  caption: {
    type: String,
    required: false
  },
  date: {
    type: Number
  },
  location: {
    type: String
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
}, {
  timestamps: true
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post;
