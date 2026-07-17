import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    id: '123',
    title: 'Testing React',
    author: 'Pranjal Singh'
  }

  test('renders blog title and author as a link', () => {
    render(
      <MemoryRouter>
        <Blog blog={blog} />
      </MemoryRouter>
    )

    expect(
      screen.getByText(
        'Testing React Pranjal Singh'
      )
    ).toBeInTheDocument()

    expect(
      screen.getByRole('link')
    ).toHaveAttribute(
      'href',
      '/blogs/123'
    )
  })
})