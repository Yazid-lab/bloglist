const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

// NOTE: 4.19: ADDING A BLOG IS ONLY POSSIBLE WITH A VALID TOKEN

blogsRouter.post('/', async (request, response, next) => {
  // NOTE: 4.20 : WITH SOME MIDDLEWARE WIZARDRY WE CAN EXTRACT THE TOKEN . THE DETAILS OF THE EXTRACTOR ARE FOUND IN THE MIDDLEWARE FILE
  const token = request.token
  const decodedToken = jwt.verify(token, process.env.SECRET)
  // NOTE: Decoded token contain a username and id of a user
  console.log(decodedToken)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token is missing or invalid' })
  }
  const body = request.body
  const user = await User.findById(decodedToken.id)
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  })
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})
// NOTE: 4.21 Deleting blogs is only possible when the user who has the right token issues the request
blogsRouter.delete('/:id', async (request, response) => {
  const token = request.token
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token is missing or invalid' })
  }

  const idToDelete = request.params.id
  const blog = await Blog.findById(idToDelete)
  if (blog.user.toString() === decodedToken.id) {
    await blog.remove()
    return response.status(204).end()
  }
  return response
    .status(403)
    .json({ error: 'user has no permission to delete this resource' })
})
blogsRouter.put('/:id', async (request, response, next) => {
  try {
    const id = request.params.id
    const body = request.body
    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
    }
    const updatedBlog = await Blog.findByIdAndUpdate(id, blog, { new: true })
    response.json(updatedBlog)
  } catch (error) {
    next(error)
  }
})
module.exports = blogsRouter
