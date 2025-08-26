//const ROOT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJpZCI6IjY4YWQ2Y2YyNGM3MzQ0OGZmMzNiY2U5ZCIsImlhdCI6MTc1NjIwMDk4NH0.akvVsnTKLbARQ0iQO_bnUmUxUMT9-AqX6s2IbsQMJl8'
const { test, before, after, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const bcrypt = require('bcrypt')

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

let rootToken

before(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})

  const passwordHash = await bcrypt.hash('salasana', 10)
  const user = new User({ username: 'root', name: 'Pääkäyttäjä', passwordHash })
  const savedUser = await user.save()

  const response = await api
    .post('/api/login')
    .send({ username: 'root', password: 'salasana' })
  rootToken = response.body.token

  const blogsWithUsers = listWithThreeBlogs.map(blog => ({
    ...blog,
    user: savedUser._id
  }))

  const insertedBlogs = await Blog.insertMany(blogsWithUsers)

  savedUser.blogs = insertedBlogs.map(b => b._id)
  await savedUser.save()
})

const Blog = require('../models/blog')

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

test('any blog can be added', async () => {
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
    .set('Authorization', `Bearer ${rootToken}`)
    .send(newEntry)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const finalBlogs = await Blog.find({})
  assert.strictEqual(finalBlogs.length, initialCount + 1)
})

test('no likes added defaults to 0 likes', async () => {
  const newEntry = {
    title: 'Testing blog entries ',
    author: 'Mr. Tester',
    url: 'https://mrtestertesting.test',
    //likes: 60
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${rootToken}`)
    .send(newEntry)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 0)
})

test('entries with missing title or url are answered with 400', async () => {
  const newEntryNoTitle = {
    //title: 'Testing blog entries ',
    author: 'Mr. Tester',
    url: 'https://mrtestertesting.test',
    likes: 60
  }

  const newEntryNoUrl = {
    title: 'Testing blog entries ',
    author: 'Mr. Tester',
    //url: 'https://mrtestertesting.test',
    likes: 60
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${rootToken}`)
    .send(newEntryNoTitle)
    .expect(400)

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${rootToken}`)
    .send(newEntryNoUrl)
    .expect(400)
})

test('it is possible to delete a blog', async () => {
  const initialBlogs = await Blog.find({})
  const firstBlog = initialBlogs[0]

  await api
    .delete(`/api/blogs/${firstBlog.id}`)
    .set('Authorization', `Bearer ${rootToken}`)
    .expect(204)

  const finalBlogs = await Blog.find({})
  assert.strictEqual(finalBlogs.length, initialBlogs.length - 1)
})

test('a blog was successfully updated', async () => {
  const initialBlogs = await Blog.find({})
  const firstBlog = initialBlogs[0]
  
  const updatedBlogData = {
    title: firstBlog.title,
    author: firstBlog.author,
    url: firstBlog.url,
    likes: firstBlog.likes + 1
  }

  const response = await api
    .put(`/api/blogs/${firstBlog.id}`)
    .set('Authorization', `Bearer ${rootToken}`)
    .send(updatedBlogData)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, firstBlog.likes + 1)
  assert.strictEqual(response.body.id, firstBlog.id)
})

test('adding a blog fails with 401 if token is missing', async () => {
  const newEntry = {
    title: 'A blog for no tokens',
    author: 'Some Pirate',
    url: 'https://notoken.test',
    likes: 0
  }

  await api
    .post('/api/blogs')
    .send(newEntry)
    .expect(401)
})

describe('no invalid users or passwords created', () => {
  test('user creation fails with too short password', async () => {
    const newUser = { username: 'newUser', name: 'Jorma', password: 'pw' }
    const res = await api.post('/api/users').send(newUser).expect(400)
    assert.match(res.body.error, /password/i)
  })

  test('user creation fails with missing username', async () => {
    const newUser = { name: 'Jorma', password: 'salasana' }
    const res = await api.post('/api/users').send(newUser).expect(400)
    assert.match(res.body.error, /username/i)
  })

  test('user creation fails with duplicate username', async () => {
    const newUser = { username: 'root', name: 'Daniel Duplikaatti', password: 'salasana' }
    const res = await api.post('/api/users').send(newUser).expect(409)
    assert.match(res.body.error, /unique|exists/i)
  })
})

after(async () => {
  await mongoose.connection.close()
})