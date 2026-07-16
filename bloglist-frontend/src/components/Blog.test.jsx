import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    title: 'Testing React',
    author: 'Pranjal Singh',
    url: 'https://example.com',
    likes: 5,
    user: {
      username: 'root',
      name: 'Super User'
    }
  }

  const loggedInUser = {
    username: 'root',
    name: 'Super User'
  }

  test('renders title and author but not url or likes by default', () => {
    render(
      <Blog
        blog={blog}
        loggedInUser={loggedInUser}
        handleLike={() => {}}
        handleDelete={() => {}}
      />
    )

    expect(
  screen.getAllByText(/Testing React/)
).toHaveLength(2)

expect(
  screen.queryByText('https://example.com')
).not.toBeVisible()

expect(
  screen.queryByText(/likes/)
).not.toBeVisible()

    expect(
      screen.queryByText('https://example.com')
    ).not.toBeVisible()

    expect(
      screen.queryByText(/likes/)
    ).not.toBeVisible()
  })

  test('shows url and likes after clicking view', async () => {
    const user = userEvent.setup()

    render(
      <Blog
        blog={blog}
        loggedInUser={loggedInUser}
        handleLike={() => {}}
        handleDelete={() => {}}
      />
    )

    await user.click(
      screen.getByText('view')
    )

    expect(
      screen.getByText('https://example.com')
    ).toBeVisible()

    expect(
      screen.getByText(/likes/)
    ).toBeVisible()
  })

  test('clicking like button twice calls event handler twice', async () => {
    const mockLikeHandler = vi.fn()

    const user = userEvent.setup()

    render(
      <Blog
        blog={blog}
        loggedInUser={loggedInUser}
        handleLike={mockLikeHandler}
        handleDelete={() => {}}
      />
    )

    await user.click(
      screen.getByText('view')
    )

    const likeButton =
      screen.getByText('like')

    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockLikeHandler.mock.calls)
      .toHaveLength(2)
  })
})