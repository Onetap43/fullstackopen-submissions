const assert = require('node:assert')
const {
  test,
  after,
  beforeEach,
  describe
} = require('node:test')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

let testUser
let token

describe('when there are initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)

    testUser = new User({
      username: 'root',
      name: 'Super User',
      passwordHash
    })

    await testUser.save()

    token = jwt.sign(
      {
        username: testUser.username,
        id: testUser._id
      },
      process.env.SECRET
    )

    const blogsWithUser = helper.initialBlogs.map(blog => ({
      ...blog,
      user: testUser._id
    }))

    const savedBlogs = await Blog.insertMany(blogsWithUser)

    testUser.blogs = savedBlogs.map(blog => blog._id)

    await testUser.save()
  })

  describe('getting all blogs', () => {
    test('blogs are returned as JSON', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('correct number of blogs is returned', async () => {
      const response = await api.get('/api/blogs')

      assert.strictEqual(
        response.body.length,
        helper.initialBlogs.length
      )
    })

    test('unique identifier property is named id', async () => {
      const response = await api.get('/api/blogs')

      response.body.forEach(blog => {
        assert(blog.id)
        assert.strictEqual(blog._id, undefined)
      })
    })

    test('creator information is populated', async () => {
      const response = await api.get('/api/blogs')

      response.body.forEach(blog => {
        assert.strictEqual(blog.user.username, 'root')
        assert.strictEqual(blog.user.name, 'Super User')
      })
    })
  })

  describe('viewing a specific blog', () => {
    test('succeeds with a valid id', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToView = blogsAtStart[0]

      await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('fails with 404 when blog does not exist', async () => {
      const validNonExistingId =
        await helper.nonExistingId()

      await api
        .get(`/api/blogs/${validNonExistingId}`)
        .expect(404)
    })

    test('fails with 400 when id is invalid', async () => {
      await api
        .get('/api/blogs/invalid-blog-id')
        .expect(400)
    })
  })

  describe('addition of a new blog', () => {
    test('succeeds with valid token', async () => {
      const newBlog = {
        title: 'Async and Await',
        author: 'Pranjal Singh',
        url: 'https://example.com/async-await',
        likes: 12
      }

      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(
        response.body.user.username,
        'root'
      )

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(
        blogsAtEnd.length,
        helper.initialBlogs.length + 1
      )

      const titles = blogsAtEnd.map(blog => blog.title)

      assert(titles.includes('Async and Await'))

      const userAtEnd = await User.findById(testUser.id)

      assert.strictEqual(
        userAtEnd.blogs.length,
        helper.initialBlogs.length + 1
      )
    })

    test('fails with 401 if token is missing', async () => {
      const newBlog = {
        title: 'No token',
        author: 'Pranjal',
        url: 'https://example.com',
        likes: 5
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
    })

    test('likes defaults to zero when missing', async () => {
      const newBlog = {
        title: 'Blog without likes',
        author: 'Pranjal Singh',
        url: 'https://example.com/no-likes'
      }

      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)

      assert.strictEqual(response.body.likes, 0)
    })

    test('fails with 400 when title is missing', async () => {
      const newBlog = {
        author: 'Pranjal Singh',
        url: 'https://example.com/no-title',
        likes: 5
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)
    })

    test('fails with 400 when url is missing', async () => {
      const newBlog = {
        title: 'Blog without URL',
        author: 'Pranjal Singh',
        likes: 5
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)
    })
  })

  describe('deletion of a blog', () => {
    test('creator succeeds with 204', async () => {
      const blogsAtStart = await helper.blogsInDb()

      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(
        blogsAtEnd.length,
        helper.initialBlogs.length - 1
      )
    })

    test('fails with 401 if token missing', async () => {
      const blogsAtStart = await helper.blogsInDb()

      await api
        .delete(`/api/blogs/${blogsAtStart[0].id}`)
        .expect(401)
    })

    test('fails with 400 when id is invalid', async () => {
      await api
        .delete('/api/blogs/invalid-blog-id')
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
    })
  })

  describe('updating a blog', () => {
    test('updates the likes of an existing blog', async () => {
      const blogsAtStart = await helper.blogsInDb()

      const blogToUpdate = blogsAtStart[0]

      const updatedBlog = {
        title: blogToUpdate.title,
        author: blogToUpdate.author,
        url: blogToUpdate.url,
        likes: 99
      }

      const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.likes, 99)

      const blogsAtEnd = await helper.blogsInDb()

      const storedBlog = blogsAtEnd.find(
        blog => blog.id === blogToUpdate.id
      )

      assert.strictEqual(storedBlog.likes, 99)
    })

    test('fails with 404 when blog does not exist', async () => {
      const validNonExistingId =
        await helper.nonExistingId()

      const updatedBlog = {
        title: 'Missing blog',
        author: 'Nobody',
        url: 'https://example.com/missing',
        likes: 1
      }

      await api
        .put(`/api/blogs/${validNonExistingId}`)
        .send(updatedBlog)
        .expect(404)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})