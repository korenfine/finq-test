import { test, expect } from '@playwright/test';

test('Home -> Fetch opens the random list with 10 people', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Fetch' }).click();

  await expect(page).toHaveURL(/\/random$/);
  await expect(page.getByTestId('person-row')).toHaveCount(10);
});

test('Home -> History opens the saved profiles screen', async ({ page }) => {
  await page.goto('/');
  // Scoped to <main> because the persistent header nav also has a "History" link.
  await page.locator('main').getByRole('button', { name: 'History' }).click();

  await expect(page).toHaveURL(/\/saved$/);
  await expect(page.getByRole('heading', { name: 'Saved Profiles' })).toBeVisible();
});
