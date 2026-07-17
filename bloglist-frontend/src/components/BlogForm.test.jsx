import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import BlogForm from './BlogForm'

test('<BlogForm /> calls createBlog with correct details', async () => {
  const createBlog = vi.fn()

  const user = userEvent.setup()

  render(
    <MemoryRouter>
      <BlogForm createBlog={createBlog} />
    </MemoryRouter>
  )

  const inputs = screen.getAllByRole('textbox')

  await user.type(inputs[0], 'React Testing')
  await user.type(inputs[1], 'Pranjal Singh')
  await user.type(inputs[2], 'https://example.com')

  await user.click(screen.getByText('create'))

  expect(createBlog).toHaveBeenCalledTimes(1)

  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'React Testing',
    author: 'Pranjal Singh',
    url: 'https://example.com'
  })
})