import { useEffect, useState } from 'react'
import {
  Link,
  Navigate,
  Route,
  Routes,
  useMatch,
  useNavigate
} from 'react-router-dom'

import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography
} from '@mui/material'

import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'
import BlogView from './components/BlogView'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [notification, setNotification] =
    useState({
      message: null,
      type: 'success'
    })

  const navigate = useNavigate()

  const blogMatch = useMatch('/blogs/:id')

  const selectedBlog = blogMatch
    ? blogs.find(
        (blog) =>
          blog.id === blogMatch.params.id
      )
    : null

  const showNotification = (
    message,
    type = 'success'
  ) => {
    setNotification({
      message,
      type
    })

    window.setTimeout(() => {
      setNotification({
        message: null,
        type: 'success'
      })
    }, 5000)
  }

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const initialBlogs =
          await blogService.getAll()

        setBlogs(initialBlogs)
      } catch {
        showNotification(
          'could not load blogs',
          'error'
        )
      }
    }

    fetchBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON =
      window.localStorage.getItem(
        'loggedBlogappUser'
      )

    if (loggedUserJSON) {
      const savedUser =
        JSON.parse(loggedUserJSON)

      setUser(savedUser)
      blogService.setToken(savedUser.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const loggedUser =
        await loginService.login({
          username,
          password
        })

      window.localStorage.setItem(
        'loggedBlogappUser',
        JSON.stringify(loggedUser)
      )

      blogService.setToken(
        loggedUser.token
      )

      setUser(loggedUser)
      setUsername('')
      setPassword('')

      navigate('/')
    } catch {
      showNotification(
        'wrong username or password',
        'error'
      )
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem(
      'loggedBlogappUser'
    )

    blogService.setToken(null)

    setUser(null)
    setUsername('')
    setPassword('')

    navigate('/')
  }
  
  const addBlog = async (blogObject) => {
    try {
      const createdBlog =
        await blogService.create(blogObject)

      setBlogs((currentBlogs) =>
        currentBlogs.concat(createdBlog)
      )

      showNotification(
        `a new blog ${createdBlog.title} by ${createdBlog.author} added`
      )

      navigate('/')

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
    if (!user) {
      showNotification(
        'you must be logged in to like a blog',
        'error'
      )
      return
    }

    const blogToUpdate = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user?.id ?? blog.user
    }

    try {
      const returnedBlog =
        await blogService.update(
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
          (currentBlog) =>
            currentBlog.id !== blog.id
        )
      )

      showNotification(
        `blog ${blog.title} by ${blog.author} removed`
      )

      navigate('/')
    } catch {
      showNotification(
        `could not remove ${blog.title}`,
        'error'
      )
    }
  }

  const sortedBlogs = [...blogs].sort(
    (a, b) => b.likes - a.likes
  )

  return (
    <Container maxWidth="lg">

      <AppBar position="static">
        <Toolbar>

          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontWeight: 'bold'
            }}
          >
            Blog App
          </Typography>

          <Button
            color="inherit"
            component={Link}
            to="/"
          >
            Blogs
          </Button>

          {user && (
            <Button
              color="inherit"
              component={Link}
              to="/create"
            >
              Create Blog
            </Button>
          )}

          {!user ? (
            <Button
              color="inherit"
              component={Link}
              to="/login"
            >
              Login
            </Button>
          ) : (
            <>
              <Typography
                sx={{
                  mx: 2
                }}
              >
                {user.name} logged in
              </Typography>

              <Button
                color="inherit"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          )}

        </Toolbar>
      </AppBar>

      <Box mt={3}>

        <Notification
          message={notification.message}
          type={notification.type}
        />

        <Routes>
        <Route
            path="/"
            element={
              <BlogList
                blogs={sortedBlogs}
              />
            }
          />

          <Route
            path="/login"
            element={
              user ? (
                <Navigate
                  replace
                  to="/"
                />
              ) : (
                <LoginForm
                  username={username}
                  password={password}
                  handleSubmit={handleLogin}
                  handleUsernameChange={({
                    target
                  }) =>
                    setUsername(target.value)
                  }
                  handlePasswordChange={({
                    target
                  }) =>
                    setPassword(target.value)
                  }
                />
              )
            }
          />

          <Route
            path="/blogs/:id"
            element={
              <BlogView
                blog={selectedBlog}
                loggedInUser={user}
                handleLike={likeBlog}
                handleDelete={deleteBlog}
              />
            }
          />

          <Route
            path="/create"
            element={
              user ? (
                <BlogForm
                  createBlog={addBlog}
                />
              ) : (
                <Navigate
                  replace
                  to="/login"
                />
              )
            }
          />

          <Route
            path="*"
            element={
              <Navigate
                replace
                to="/"
              />
            }
          />
        </Routes>

      </Box>

    </Container>
  )
}

export default App