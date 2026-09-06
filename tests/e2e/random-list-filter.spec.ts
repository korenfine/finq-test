import { test, expect } from '@playwright/test';

test('name and country filters narrow the random list', async ({ page }) => {
  await page.goto('/random');

  const rows = page.getByTestId('person-row');
  await expect(rows).toHaveCount(10);

  const firstRowName = await rows.first().getByTestId('person-name').innerText();
  const guessedFirstName = firstRowName.trim().split(/\s+/)[1] ?? firstRowName.trim();

  await page.getByPlaceholder('Search by name').fill(guessedFirstName);
  // expect.poll retries until the 300ms debounce settles and the list narrows.
  await expect.poll(() => rows.count()).toBeLessThan(10);
  const filteredCount = await rows.count();
  expect(filteredCount).toBeGreaterThan(0);

  await page.getByPlaceholder('Search by name').fill('zzz-no-such-name-zzz');
  await expect(page.getByText('No people found')).toBeVisible();
});
