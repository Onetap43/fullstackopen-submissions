import { useEffect, useRef, useState } from 'react'

import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [notification, setNotification] = useState({
    message: null,
    type: 'success'
  })

  const blogFormRef = useRef()

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const initialBlogs = await blogService.getAll()
        setBlogs(initialBlogs)
      } catch {
        showNotification('could not load blogs', 'error')
      }
    }

    fetchBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(
      'loggedBlogappUser'
    )

    if (loggedUserJSON) {
      const savedUser = JSON.parse(loggedUserJSON)

      setUser(savedUser)
      blogService.setToken(savedUser.token)
    }
  }, [])

  const showNotification = (message, type = 'success') => {
    setNotification({
      message,
      type
    })

    setTimeout(() => {
      setNotification({
        message: null,
        type: 'success'
      })
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const loggedUser = await loginService.login({
        username,
        password
      })

      window.localStorage.setItem(
        'loggedBlogappUser',
        JSON.stringify(loggedUser)
      )

      blogService.setToken(loggedUser.token)
      setUser(loggedUser)

      setUsername('')
      setPassword('')
    } catch {
      showNotification(
        'wrong username or password',
        'error'
      )
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')

    blogService.setToken(null)
    setUser(null)
    setUsername('')
    setPassword('')
  }

  const addBlog = async (blogObject) => {
    try {
      const createdBlog = await blogService.create(blogObject)

      setBlogs((currentBlogs) =>
        currentBlogs.concat(createdBlog)
      )

      blogFormRef.current.toggleVisibility()

      showNotification(
        `a new blog ${createdBlog.title} by ${createdBlog.author} added`
      )

      return true
    } catch {
      showNotification(
        'creating a blog failed',
        'error'
      )

      return false
    }
  }

  const likeBlog = async (blog) => {
    const blogToUpdate = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user?.id ?? blog.user
    }

    try {
      const returnedBlog = await blogService.update(
        blog.id,
        blogToUpdate
      )

      const updatedBlog = {
        ...returnedBlog,
        user: blog.user
      }

      setBlogs((currentBlogs) =>
        currentBlogs.map((currentBlog) =>
          currentBlog.id === blog.id
            ? updatedBlog
            : currentBlog
        )
      )
    } catch {
      showNotification(
        `could not like ${blog.title}`,
        'error'
      )
    }
  }

  const deleteBlog = async (blog) => {
    const shouldDelete = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}?`
    )

    if (!shouldDelete) {
      return
    }

    try {
      await blogService.remove(blog.id)

      setBlogs((currentBlogs) =>
        currentBlogs.filter(
          (currentBlog) => currentBlog.id !== blog.id
        )
      )

      showNotification(
        `blog ${blog.title} by ${blog.author} removed`
      )
    } catch {
      showNotification(
        `could not remove ${blog.title}`,
        'error'
      )
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>

        <Notification
          message={notification.message}
          type={notification.type}
        />

        <LoginForm
          username={username}
          password={password}
          handleSubmit={handleLogin}
          handleUsernameChange={({ target }) =>
            setUsername(target.value)
          }
          handlePasswordChange={({ target }) =>
            setPassword(target.value)
          }
        />
      </div>
    )
  }

  const sortedBlogs = [...blogs].sort(
    (firstBlog, secondBlog) =>
      secondBlog.likes - firstBlog.likes
  )

  return (
    <div>
      <h2>blogs</h2>

      <Notification
        message={notification.message}
        type={notification.type}
      />

      <p>
        {user.name} logged in{' '}
        <button onClick={handleLogout}>
          logout
        </button>
      </p>

      <Togglable
        buttonLabel="create new blog"
        ref={blogFormRef}
      >
        <BlogForm createBlog={addBlog} />
      </Togglable>

      {sortedBlogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          loggedInUser={user}
          handleLike={likeBlog}
          handleDelete={deleteBlog}
        />
      ))}
    </div>
  )
}

export default App