const express = require('express');

const router = new express.Router();
const Post = require('../models/post.js');
const auth = require('../middleware/auth.js');

//Post creation
router.post('/posts', auth, async (req, res) => {
  const post = new Post({
    ...req.body,
    userId: req.user._id
  })
  try {
    await post.save()
    res.send(post)
  } catch(error) {
    res.status(400).send(error)
  }
})

//Find post by ID
router.get('/posts/:id', auth, async (req, res) => {
  const _id = req.params.id
  try {
    const post = await Post.findOne({_id, userId: req.user._id})
    if (!post) {
      return res.status(404).send()
    }
    res.send(post)
  } catch (error) {
    res.status(500).send()
  }
})

//Find all posts by a certain user
router.get('/posts', auth, async (req, res) => {
  const sort = {}
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':')
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
  }
  try {
    await req.user.populate({
      path: 'posts',
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort
      }
    }).execPopulate()
    res.send(req.user.posts)
  } catch(error) {
    res.status(500).send(error)
  }
})

//Update a post by ID
router.patch('/posts/:id', auth, async (req, res) => {
  const _id = req.params.id
  const updates = Object.keys(req.body)
  const allowedUpdates = ['caption', 'location', 'date']
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
  if (!isValidOperation) return res.status(400).send()
  try {
    const post = await Post.findOne({ _id, userId: req.user._id})
    if (!post) return res.status(404).send()
    updates.forEach((update) => { post[update] = req.body[update] })
    await post.save()
    res.send(post)
  } catch {
    res.status(400).send()
  }
})

//Delete post
router.delete('/posts/:id', auth, async (req, res) => {
  const _id = req.params.id
  try {
    const post = await Post.findOneAndDelete({_id, userId: req.user._id})
    if (!post) {
      return res.status(404).send()
    }
    res.send(post)
  } catch (error) {
    res.status(500).send()
  }
})

module.exports = router;
