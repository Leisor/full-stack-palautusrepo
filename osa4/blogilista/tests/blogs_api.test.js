const { test, before, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const listWithThreeBlogs = [
        {
           // _id: '5a422a851b54a676234d17f7',
            title: 'React patterns',
            author: 'Michael Chan',
            url: 'https://reactpatterns.com/',
            likes: 7,
            __v: 0
        },
        {
    //        _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 5,
            __v: 0
        },
        {
       //     _id: '5a422b3a1b54a676234d17f9',
            title: 'Canonical string reduction',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
            likes: 12,
            __v: 0
        }
    ]

const Blog = require('../models/blog')
before(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(listWithThreeBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('blog identifier must be id, not _id', async () => {
    const blogsInDatabase = await Blog.find({})
    const id = blogsInDatabase[0].id

    const response = await api
      .get(`/api/blogs/${id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blog = response.body

    assert.ok(blog.id)
    assert.strictEqual(blog._id, undefined)
        
})

test.only('any blog can be added', async () => {
  const newEntry = {
    title: 'Testing blog entries ',
    author: 'Mr. Tester',
    url: 'https://mrtestertesting.test',
    likes: 60
  }

  const initialBlogs = await Blog.find({})
  const initialCount = initialBlogs.length

  await api
    .post('/api/blogs')
    .send(newEntry)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const finalBlogs = await Blog.find({})
  assert.strictEqual(finalBlogs.length, initialCount + 1)
})

after(async () => {
  await mongoose.connection.close()
})