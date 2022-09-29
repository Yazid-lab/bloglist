const userRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
// TODO: ADD TEST TO CHECK THE VALIDATION PROCESS
// NOTE: 4.15
userRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs')
  response.json(users)
})

userRouter.post('/', async (request, response) => {
  // NOTE: 4.16 add restrictions on the username and the password
  const { username, name, password } = request.body
  if (!username || !password) {
    return response.status(400).json({ error: 'missing username or password' })
  }
  if (username.length < 3) {
    return response.status(400).json({error: 'username must be at least 3 characters long'})
  }
  if (password.length < 3) {
    return response.status(400).json({error: 'password must be at least 3 characters long'})
  }

  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return response.status(400).json({ error: 'username must be unique' })
  }
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  const user = new User({
    username,
    name,
    passwordHash,
  })
  const savedUser = await user.save()
  response.status(201).json(savedUser)
})
module.exports = userRouter
