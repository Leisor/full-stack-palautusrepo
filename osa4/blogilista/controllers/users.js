const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1 })
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!username) {
    return response.status(400).json({
      error: 'Missing username'
    })
  }  

  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return response.status(409).json({
      error: 'Username already exists'
    })
  }  

  if (!password || password.length < 3) {
    return response.status(400).json({
      error: 'Enter a password that\'s at least 3 characters long'
    })
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

module.exports = usersRouter