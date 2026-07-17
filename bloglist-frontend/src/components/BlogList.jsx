import { Link } from 'react-router-dom'

const BlogList = ({ blogs }) => {
  return (
    <div>
      <h2>blogs</h2>

      <ul>
        {blogs.map((blog) => (
          <li key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>
              {blog.title} by {blog.author}
            </Link>
          </li>
        ))}
      </ul>

      <Link to="/create">
        create new blog
      </Link>
    </div>
  )
}

export default BlogList