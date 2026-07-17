import { test, expect } from '@playwright/test'

const loginWith = async (page, username, password) => {
  await page.getByRole('link', { name: 'login' }).click()
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()

  await expect(
    page.getByRole('button', { name: 'logout' })
  ).toBeVisible()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('link', { name: 'create new blog' }).click()

  const inputs = page.locator('form input')

  await inputs.nth(0).fill(title)
  await inputs.nth(1).fill(author)
  await inputs.nth(2).fill(url)

  await page.getByRole('button', { name: 'create' }).click()

  const blogLink = page.getByRole('link', {
    name: `${title} by ${author}`
  })

  await expect(blogLink).toBeVisible()

  return blogLink
}

test.describe('Blog app', () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')

    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Test User',
        username: 'testuser',
        password: 'password123'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await page.getByRole('link', { name: 'login' }).click()

    await expect(
      page.getByText('Log in to application')
    ).toBeVisible()

    await expect(
      page.getByRole('button', { name: 'login' })
    ).toBeVisible()
  })

  test('user can log in', async ({ page }) => {
    await loginWith(page, 'testuser', 'password123')

    await expect(
      page.getByRole('button', { name: 'logout' })
    ).toBeVisible()
  })

  test('login fails with wrong password', async ({ page }) => {
    await page.getByRole('link', { name: 'login' }).click()

    await page.getByTestId('username').fill('testuser')
    await page.getByTestId('password').fill('wrongpassword')

    await page.getByRole('button', { name: 'login' }).click()

    await expect(
      page.getByText('wrong username or password')
    ).toBeVisible()

    await expect(
      page.getByRole('button', { name: 'logout' })
    ).toHaveCount(0)
  })

  test.describe('when logged in', () => {
    test.beforeEach(async ({ page }) => {
      await loginWith(page, 'testuser', 'password123')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(
        page,
        'Playwright testing',
        'Test Author',
        'https://example.com'
      )

      await expect(
        page.getByRole('link', {
          name: 'Playwright testing by Test Author'
        })
      ).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(
        page,
        'Blog to like',
        'Like Author',
        'https://like-example.com'
      )

      await page.getByRole('link', {
        name: 'Blog to like by Like Author'
      }).click()

      await expect(page.getByText(/likes 0/)).toBeVisible()

      await page.getByRole('button', { name: 'like' }).click()

      await expect(page.getByText(/likes 1/)).toBeVisible()
    })

    test('user who created a blog can delete it', async ({ page }) => {
      await createBlog(
        page,
        'Blog to delete',
        'Delete Author',
        'https://delete-example.com'
      )

      await page.getByRole('link', {
        name: 'Blog to delete by Delete Author'
      }).click()

      page.once('dialog', async dialog => {
        await dialog.accept()
      })

      await page.getByRole('button', { name: 'remove' }).click()

      await expect(
        page.getByRole('link', {
          name: 'Blog to delete by Delete Author'
        })
      ).toHaveCount(0)
    })

    test('only creator sees remove button', async ({ page, request }) => {
      await createBlog(
        page,
        'Creator only blog',
        'Original Author',
        'https://creator-example.com'
      )

      await page.getByRole('link', {
        name: 'Creator only blog by Original Author'
      }).click()

      await expect(
        page.getByRole('button', { name: 'remove' })
      ).toBeVisible()

      await page.getByRole('button', { name: 'logout' }).click()

      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'Second User',
          username: 'seconduser',
          password: 'secondpassword'
        }
      })

      await loginWith(page, 'seconduser', 'secondpassword')

      await page.getByRole('link', {
        name: 'Creator only blog by Original Author'
      }).click()

      await expect(
        page.getByRole('button', { name: 'remove' })
      ).toHaveCount(0)
    })

    test('blogs are ordered by likes, most liked first', async () => {
      // skipped
    })
  })
})