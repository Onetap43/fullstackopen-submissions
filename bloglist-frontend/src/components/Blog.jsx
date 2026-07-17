import { useState } from 'react'

const Blog = ({
  blog,
  loggedInUser,
  handleLike,
  handleDelete
}) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const showWhenVisible = {
    display: visible ? '' : 'none'
  }

  const hideWhenVisible = {
    display: visible ? 'none' : ''
  }

  const canDelete =
    blog.user &&
    loggedInUser &&
    blog.user.username === loggedInUser.username

  return (
    <div className="blog" style={blogStyle}>
      <div style={hideWhenVisible}>
        {blog.title} {blog.author}{' '}
        <button onClick={() => setVisible(true)}>
          view
        </button>
      </div>

      <div style={showWhenVisible}>
        <div>
          {blog.title} {blog.author}{' '}
          <button onClick={() => setVisible(false)}>
            hide
          </button>
        </div>

        <div>{blog.url}</div>

        <div>
          likes {blog.likes}{' '}
          <button onClick={() => handleLike(blog)}>
            like
          </button>
        </div>

        <div>{blog.user?.name}</div>

        {canDelete && (
          <button onClick={() => handleDelete(blog)}>
            remove
          </button>
        )}
      </div>
    </div>
  )
}

export default Blog