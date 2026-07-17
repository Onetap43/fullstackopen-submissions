import { Link } from 'react-router-dom'

const Blog = ({ blog }) => {
  return (
    <div
      className="blog"
      style={{
        padding: 10,
        border: '1px solid black',
        marginBottom: 5
      }}
    >
      <Link to={`/blogs/${blog.id}`}>
        {blog.title} {blog.author}
      </Link>
    </div>
  )
}

export default Blog