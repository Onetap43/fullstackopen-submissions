import { Link } from 'react-router-dom'

import {
  Box,
  Button,
  Card,
  CardContent,
  Link as MuiLink,
  Typography
} from '@mui/material'

const BlogView = ({
  blog,
  loggedInUser,
  handleLike,
  handleDelete
}) => {
  if (!blog) {
    return null
  }

  const canDelete =
    blog.user &&
    loggedInUser &&
    blog.user.username ===
      loggedInUser.username

  return (
    <Box>

      <Button
        component={Link}
        to="/"
        variant="outlined"
        sx={{ mb: 2 }}
      >
        ← Back to Blogs
      </Button>

      <Card>

        <CardContent>

          <Typography
            variant="h4"
            gutterBottom
          >
            {blog.title}
          </Typography>

          <MuiLink
            href={blog.url}
            target="_blank"
            rel="noreferrer"
          >
            {blog.url}
          </MuiLink>

          <Typography
            sx={{ mt: 2 }}
          >
            Likes: {blog.likes}
          </Typography>

          {loggedInUser && (
            <Button
              variant="contained"
              sx={{ mt: 1, mb: 2 }}
              onClick={() =>
                handleLike(blog)
              }
            >
              Like
            </Button>
          )}

          <Typography>
            Added by {blog.user?.name}
          </Typography>

          {canDelete && (
            <Button
              color="error"
              variant="contained"
              sx={{ mt: 2 }}
              onClick={() =>
                handleDelete(blog)
              }
            >
              Remove
            </Button>
          )}

        </CardContent>

      </Card>

    </Box>
  )
}

export default BlogView