const blogsRouter = require('express').Router()

const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', {
      username: 1,
      name: 1
    })

  response.json(blogs)
})

blogsRouter.post(
  '/',
  middleware.userExtractor,
  async (request, response) => {
    const body = request.body
    const user = request.user

    if (!user) {
      return response.status(401).json({
        error: 'token missing or invalid'
      })
    }

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user._id
    })

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    const populatedBlog = await Blog.findById(savedBlog._id)
      .populate('user', {
        username: 1,
        name: 1
      })

    response.status(201).json(populatedBlog)
  }
)

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
    .populate('user', {
      username: 1,
      name: 1
    })

  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.delete(
  '/:id',
  middleware.userExtractor,
  async (request, response) => {
    const user = request.user

    if (!user) {
      return response.status(401).json({
        error: 'token missing or invalid'
      })
    }

    const blog = await Blog.findById(request.params.id)

    if (!blog) {
      return response.status(404).end()
    }

    if (blog.user.toString() !== user.id.toString()) {
      return response.status(403).json({
        error: 'only creator can delete a blog'
      })
    }

    await Blog.findByIdAndDelete(request.params.id)

    user.blogs = user.blogs.filter(
      blogId => blogId.toString() !== request.params.id
    )

    await user.save()

    response.status(204).end()
  }
)

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const updatedBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updated = await Blog.findByIdAndUpdate(
    request.params.id,
    updatedBlog,
    {
      returnDocument: 'after',
      runValidators: true
    }
  )

  if (updated) {
    response.json(updated)
  } else {
    response.status(404).end()
  }
})

module.exports = blogsRouter