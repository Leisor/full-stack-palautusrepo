const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const { info, error } = require('./utils/logger')
const blogsRouter = require('./controllers/blogs')

const app = express()
app.use('/api/blogs', blogsRouter)


mongoose.connect(config.MONGODB_URI)

app.use(express.json())



app.listen(config.PORT, () => {
  info(`Server running on port ${config.PORT}`)
})