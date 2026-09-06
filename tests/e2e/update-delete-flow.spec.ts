import { test, expect } from '@playwright/test';

test('updating a saved profile persists, and deleting removes it', async ({ page }) => {
  await page.goto('/random');
  const firstRow = page.getByTestId('person-row').first();
  await firstRow.click();
  await expect(page).toHaveURL(/\/profile\//);

  await page.getByRole('button', { name: 'שמור' }).click();
  await expect(page.getByRole('button', { name: 'מחק' })).toBeVisible();

  const nameInput = page.locator('input[dir="ltr"]').first();
  await nameInput.fill('Updated Name');
  await page.getByRole('button', { name: 'עדכן' }).click();

  await page.goto('/saved');
  await expect(page.getByText('Updated Name', { exact: false })).toBeVisible();

  await page.getByText('Updated Name', { exact: false }).first().click();
  await expect(page.getByRole('button', { name: 'מחק' })).toBeVisible();
  await page.getByRole('button', { name: 'מחק' }).click();

  const confirmDialog = page.getByRole('dialog');
  await expect(confirmDialog).toBeVisible();
  await confirmDialog.getByRole('button', { name: 'מחק פרופיל' }).click();

  await expect(page).toHaveURL(/\/saved$/);
  await expect(page.getByText('Updated Name', { exact: false })).toHaveCount(0);
});
