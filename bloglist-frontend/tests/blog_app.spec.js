import { test, expect } from '@playwright/test'

const loginWith = async (page, username, password) => {
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()

  await expect(
    page.getByRole('button', { name: 'logout' })
  ).toBeVisible()
}

const createBlog = async (
  page,
  title,
  author,
  url
) => {
  await page
    .getByRole('button', { name: 'create new blog' })
    .click()

  const inputs = page.locator('form input')

  await inputs.nth(0).fill(title)
  await inputs.nth(1).fill(author)
  await inputs.nth(2).fill(url)

  await page.getByRole('button', { name: 'create' }).click()

  const blog = page.locator('.blog').filter({
    hasText: title
  })

  await expect(blog).toBeVisible()

  return blog
}

test.describe('Blog app', () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post(
      'http://localhost:3003/api/testing/reset'
    )

    await request.post(
      'http://localhost:3003/api/users',
      {
        data: {
          name: 'Test User',
          username: 'testuser',
          password: 'password123'
        }
      }
    )

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(
      page.getByText('Log in to application')
    ).toBeVisible()

    await expect(
      page.getByRole('button', { name: 'login' })
    ).toBeVisible()
  })

  test('user can log in', async ({ page }) => {
    await loginWith(
      page,
      'testuser',
      'password123'
    )

    await expect(
      page.getByText('Test User logged in')
    ).toBeVisible()
  })

  test('login fails with wrong password', async ({ page }) => {
    await page
      .getByTestId('username')
      .fill('testuser')

    await page
      .getByTestId('password')
      .fill('wrongpassword')

    await page
      .getByRole('button', { name: 'login' })
      .click()

    await expect(
      page.getByText('wrong username or password')
    ).toBeVisible()

    await expect(
      page.getByText('Test User logged in')
    ).not.toBeVisible()
  })

  test.describe('when logged in', () => {
    test.beforeEach(async ({ page }) => {
      await loginWith(
        page,
        'testuser',
        'password123'
      )
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(
        page,
        'Playwright testing',
        'Test Author',
        'https://example.com'
      )

      await expect(
        page.locator('.blog').filter({
          hasText: 'Playwright testing'
        })
      ).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      const blog = await createBlog(
        page,
        'Blog to like',
        'Like Author',
        'https://like-example.com'
      )

      await blog
        .getByRole('button', { name: 'view' })
        .click()

      await expect(blog).toContainText('likes 0')

      await blog
        .getByRole('button', { name: 'like' })
        .click()

      await expect(blog).toContainText('likes 1')
    })

    test('user who created a blog can delete it', async ({ page }) => {
      const blog = await createBlog(
        page,
        'Blog to delete',
        'Delete Author',
        'https://delete-example.com'
      )

      await blog
        .getByRole('button', { name: 'view' })
        .click()

      page.once('dialog', async (dialog) => {
        await dialog.accept()
      })

      await blog
        .getByRole('button', { name: 'remove' })
        .click()

      await expect(blog).toHaveCount(0)
    })

    test('only the creator sees the remove button', async ({
      page,
      request
    }) => {
      const blog = await createBlog(
        page,
        'Creator only blog',
        'Original Author',
        'https://creator-example.com'
      )

      await blog
        .getByRole('button', { name: 'view' })
        .click()

      await expect(
        blog.getByRole('button', { name: 'remove' })
      ).toBeVisible()

      await page
        .getByRole('button', { name: 'logout' })
        .click()

      await request.post(
        'http://localhost:3003/api/users',
        {
          data: {
            name: 'Second User',
            username: 'seconduser',
            password: 'secondpassword'
          }
        }
      )

      await loginWith(
        page,
        'seconduser',
        'secondpassword'
      )

      const sameBlog = page.locator('.blog').filter({
        hasText: 'Creator only blog'
      })

      await sameBlog
        .getByRole('button', { name: 'view' })
        .click()

      await expect(
        sameBlog.getByRole('button', {
          name: 'remove'
        })
      ).toHaveCount(0)
    })

    test('blogs are ordered by likes, most liked first', async ({
      page
    }) => {
      const firstBlog = await createBlog(
        page,
        'First blog',
        'First Author',
        'https://first.com'
      )

      const secondBlog = await createBlog(
        page,
        'Second blog',
        'Second Author',
        'https://second.com'
      )

      const thirdBlog = await createBlog(
        page,
        'Third blog',
        'Third Author',
        'https://third.com'
      )

      await firstBlog
        .getByRole('button', { name: 'view' })
        .click()

      await secondBlog
        .getByRole('button', { name: 'view' })
        .click()

      await thirdBlog
        .getByRole('button', { name: 'view' })
        .click()

      await secondBlog
        .getByRole('button', { name: 'like' })
        .click()

      await expect(secondBlog).toContainText('likes 1')

      await thirdBlog
        .getByRole('button', { name: 'like' })
        .click()

      await expect(thirdBlog).toContainText('likes 1')

      await thirdBlog
        .getByRole('button', { name: 'like' })
        .click()

      await expect(thirdBlog).toContainText('likes 2')

      const blogs = page.locator('.blog')

      await expect(blogs.nth(0)).toContainText('Third blog')
      await expect(blogs.nth(1)).toContainText('Second blog')
      await expect(blogs.nth(2)).toContainText('First blog')
    })
  })
})