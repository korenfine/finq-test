import { test, expect } from '@playwright/test';

test('saving a random profile makes it appear in History, then cleans up', async ({ page }) => {
  await page.goto('/random');
  const firstRow = page.getByTestId('person-row').first();
  const personName = await firstRow.getByTestId('person-name').innerText();

  await firstRow.click();
  await expect(page).toHaveURL(/\/profile\//);

  await page.getByRole('button', { name: 'שמור' }).click();
  await expect(page.getByRole('button', { name: 'מחק' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'שמור' })).toHaveCount(0);

  await page.goto('/saved');
  await expect(page.getByText(personName, { exact: false })).toBeVisible();

  // Clean up so repeated test runs don't accumulate saved records.
  await page.getByText(personName, { exact: false }).first().click();
  await page.getByRole('button', { name: 'מחק' }).click();

  const confirmDialog = page.getByRole('dialog');
  await expect(confirmDialog).toBeVisible();
  await confirmDialog.getByRole('button', { name: 'מחק פרופיל' }).click();

  await expect(page).toHaveURL(/\/saved$/);
  await expect(page.getByText(personName, { exact: false })).toHaveCount(0);
});
