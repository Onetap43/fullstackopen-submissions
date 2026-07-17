import { test, expect } from '@playwright/test'

test.describe('Blog app', () => {
  test('Login form is shown', async ({ page }) => {
    await page.goto('http://localhost:5173')

    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })
})