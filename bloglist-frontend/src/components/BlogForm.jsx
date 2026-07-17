import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Button,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const navigate = useNavigate()

  const addBlog = async (event) => {
    event.preventDefault()

    const success = await createBlog({
      title,
      author,
      url
    })

    if (success) {
      setTitle('')
      setAuthor('')
      setUrl('')
      navigate('/')
    }
  }

  return (
    <Paper
      elevation={4}
      sx={{
        maxWidth: 500,
        mx: 'auto',
        mt: 5,
        p: 4
      }}
    >
      <Typography
        variant="h4"
        align="center"
        gutterBottom
      >
        Create New Blog
      </Typography>

      <Stack
        component="form"
        spacing={2}
        onSubmit={addBlog}
      >
        <TextField
          label="Title"
          fullWidth
          value={title}
          onChange={({ target }) =>
            setTitle(target.value)
          }
        />

        <TextField
          label="Author"
          fullWidth
          value={author}
          onChange={({ target }) =>
            setAuthor(target.value)
          }
        />

        <TextField
          label="URL"
          fullWidth
          value={url}
          onChange={({ target }) =>
            setUrl(target.value)
          }
        />

        <Button
          variant="contained"
          type="submit"
          size="large"
        >
          create
        </Button>
      </Stack>
    </Paper>
  )
}

export default BlogForm