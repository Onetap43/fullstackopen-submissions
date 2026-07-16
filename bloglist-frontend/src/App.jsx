import { useEffect, useState } from 'react'

import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'

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

  useEffect(() => {
    const fetchBlogs = async () => {
      const initialBlogs = await blogService.getAll()
      setBlogs(initialBlogs)
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
    } catch  {
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
  }

  const addBlog = async (blogObject) => {
    try {
      const createdBlog = await blogService.create(blogObject)

      setBlogs(blogs.concat(createdBlog))

      showNotification(
        `a new blog ${createdBlog.title} by ${createdBlog.author} added`
      )
    } catch  {
      showNotification(
        'creating a blog failed',
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

      <BlogForm createBlog={addBlog} />

      {blogs.map(blog => (
        <Blog
          key={blog.id}
          blog={blog}
        />
      ))}
    </div>
  )
}

export default App