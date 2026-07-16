const assert = require('node:assert')
const {
  test,
  after,
  beforeEach,
  describe
} = require('node:test')

const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)

describe('when there are initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
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

      response.body.forEach((blog) => {
        assert(blog.id)
        assert.strictEqual(blog._id, undefined)
      })
    })
  })

  describe('viewing a specific blog', () => {
    test('succeeds with a valid id', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToView = blogsAtStart[0]

      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(resultBlog.body, blogToView)
    })

    test('fails with 404 when blog does not exist', async () => {
      const validNonExistingId =
        await helper.nonExistingId()

      await api
        .get(`/api/blogs/${validNonExistingId}`)
        .expect(404)
    })

    test('fails with 400 when id is invalid', async () => {
      const invalidId = 'invalid-blog-id'

      await api
        .get(`/api/blogs/${invalidId}`)
        .expect(400)
    })
  })

  describe('addition of a new blog', () => {
    test('succeeds with valid data', async () => {
      const newBlog = {
        title: 'Async and Await',
        author: 'Pranjal Singh',
        url: 'https://example.com/async-await',
        likes: 12
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(
        blogsAtEnd.length,
        helper.initialBlogs.length + 1
      )

      const titles = blogsAtEnd.map((blog) => blog.title)

      assert(titles.includes('Async and Await'))
    })

    test('likes defaults to zero when missing', async () => {
      const newBlog = {
        title: 'Blog without likes',
        author: 'Pranjal Singh',
        url: 'https://example.com/no-likes'
      }

      const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

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
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(
        blogsAtEnd.length,
        helper.initialBlogs.length
      )
    })

    test('fails with 400 when url is missing', async () => {
      const newBlog = {
        title: 'Blog without URL',
        author: 'Pranjal Singh',
        likes: 5
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(
        blogsAtEnd.length,
        helper.initialBlogs.length
      )
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with 204 when id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      const ids = blogsAtEnd.map((blog) => blog.id)

      assert(!ids.includes(blogToDelete.id))

      assert.strictEqual(
        blogsAtEnd.length,
        helper.initialBlogs.length - 1
      )
    })

    test('fails with 400 when id is invalid', async () => {
      await api
        .delete('/api/blogs/invalid-blog-id')
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
        (blog) => blog.id === blogToUpdate.id
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