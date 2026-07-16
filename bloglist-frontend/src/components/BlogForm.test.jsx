import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> calls createBlog with correct details', async () => {
  const createBlog = vi.fn()

  const user = userEvent.setup()

  render(
    <BlogForm createBlog={createBlog} />
  )

  const inputs = screen.getAllByRole('textbox')

  const titleInput = inputs[0]
  const authorInput = inputs[1]
  const urlInput = inputs[2]

  const createButton =
    screen.getByText('create')

  await user.type(titleInput, 'React Testing')
  await user.type(authorInput, 'Pranjal Singh')
  await user.type(urlInput, 'https://example.com')

  await user.click(createButton)

  expect(createBlog.mock.calls).toHaveLength(1)

  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'React Testing',
    author: 'Pranjal Singh',
    url: 'https://example.com'
  })
})