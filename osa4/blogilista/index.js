const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const { info, error } = require('./utils/logger')
const blogsRouter = require('./controllers/blogs')

const app = express()

mongoose.connect(config.MONGODB_URI)

app.use(express.json())
app.use('/api/blogs', blogsRouter)

app.listen(config.PORT, () => {
  info(`Server running on port ${config.PORT}`)
})