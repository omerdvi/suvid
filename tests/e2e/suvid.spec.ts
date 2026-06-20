import { expect, test } from '@playwright/test';

test('mobile user can search asado, calculate start time, rate, and suggest a recipe', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'מה יש לך להכין?' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'כל חומרי הגלם' })).toBeVisible();
  await page.getByPlaceholder('לדוגמה: אסאדו, סלמון, טופו').fill('אסאדו');
  await page.getByRole('button', { name: 'חפש' }).click();

  await expect(page.getByText('75°C')).toBeVisible();
  await expect(page.getByText('24 שעות')).toBeVisible();
  await expect(page.getByText('רך מאוד, עדיין מחזיק צורה')).toBeVisible();
  await expect(page.getByText(/נתח עבה מאוד:/)).not.toBeVisible();
  await page.getByLabel('עובי הנתח (ס״מ)').fill('5');
  await expect(page.getByText(/נתח עבה מאוד:/)).toBeVisible();

  await page.getByLabel('שעה').selectOption('20');
  await page.getByLabel('דקות').selectOption('00');
  await expect(page.getByText('שעת הגשה: 20:00')).toBeVisible();
  await page.getByRole('button', { name: 'חשב מתי להתחיל' }).click();
  await expect(page.getByText('להתחיל בערך')).toBeVisible();

  await page.getByLabel('דירוג').selectOption('5');
  await page.getByLabel('הערה').fill('מצוין');
  await page.getByLabel('מרקם').fill('בדיוק');
  await page.getByLabel('בפעם הבאה').fill('עוד צריבה');
  await page.getByRole('button', { name: 'שלח דירוג' }).click();
  await expect(page.getByText('הדירוג נשמר')).toBeVisible();
  await expect(page.getByText(/דירוג משתמשים:/)).toBeVisible();

  await page.getByRole('button', { name: 'הצע מתכון' }).click();
  await page.getByLabel('שם חומר גלם').fill('פרגית');
  await page.getByLabel('הכנות').fill('מלח ופפריקה');
  await page.getByLabel('סיום').fill('צריבה במחבת');
  await page.getByLabel('הערות להצעה').fill('לבדיקה');
  await page.getByRole('button', { name: 'שלח הצעה' }).click();
  await expect(page.getByText('ההצעה נשמרה לבדיקה')).toBeVisible();
});

test('admin can review and approve a submitted suggestion', async ({ page }) => {
  const marker = `בדיקת ניהול ${Date.now()}`;
  await page.goto('/');

  await page.getByPlaceholder('לדוגמה: אסאדו, סלמון, טופו').fill('אסאדו');
  await page.getByRole('button', { name: 'חפש' }).click();
  await page.getByRole('button', { name: /הצע מתכון/ }).click();
  await page.getByLabel('שם חומר גלם').fill(marker);
  await page.getByLabel('הכנות').fill('מלח ופלפל');
  await page.getByLabel('סיום').fill('צריבה במחבת');
  await page.getByLabel('הערות להצעה').fill('מתוך בדיקת E2E');
  await page.getByRole('button', { name: 'שלח הצעה' }).click();
  await expect(page.getByText('ההצעה נשמרה לבדיקה')).toBeVisible();

  await page.goto('/#admin');
  await expect(page.getByRole('heading', { name: 'ניהול הצעות מתכון' })).toBeVisible();
  await page.getByLabel('מפתח ניהול').fill('e2e-admin-key');
  await page.getByRole('button', { name: 'טען הצעות' }).click();

  const card = page.locator('.suggestion-card').filter({ hasText: marker });
  await expect(card).toBeVisible();
  await expect(card.locator('.status')).toHaveText('ממתין');
  await card.getByRole('button', { name: 'אשר' }).click();
  await expect(card.locator('.status')).toHaveText('אושר');
});

test('approved suggestion with temp and time becomes a live community option', async ({ page }) => {
  const name = `מנה קהילתית ${Date.now()}`;
  await page.goto('/');

  await page.getByPlaceholder('לדוגמה: אסאדו, סלמון, טופו').fill('אסאדו');
  await page.getByRole('button', { name: 'חפש' }).click();
  await page.getByRole('button', { name: /הצע מתכון/ }).click();
  await page.getByLabel('שם חומר גלם').fill(name);
  await page.getByLabel('טמפרטורה').fill('64');
  await page.getByLabel('זמן בשעות').fill('2');
  await page.getByLabel('הכנות').fill('מלח, כמון');
  await page.getByLabel('סיום').fill('צריבה חזקה');
  await page.getByLabel('הערות להצעה').fill('יצא עסיסי');
  await page.getByRole('button', { name: 'שלח הצעה' }).click();
  await expect(page.getByText('ההצעה נשמרה לבדיקה')).toBeVisible();

  await page.goto('/#admin');
  await page.getByLabel('מפתח ניהול').fill('e2e-admin-key');
  await page.getByRole('button', { name: 'טען הצעות' }).click();
  const card = page.locator('.suggestion-card').filter({ hasText: name });
  await card.getByRole('button', { name: 'אשר' }).click();
  await expect(card.locator('.status-live')).toBeVisible();

  await page.goto('/');
  await page.getByRole('button', { name: 'עוד…' }).click();
  const communityGroup = page.locator('.catalog-groups details').filter({ hasText: 'הצעות קהילה' });
  await expect(communityGroup).toBeVisible();
  await communityGroup.locator('summary').click();
  await communityGroup.getByRole('button', { name }).click();
  await expect(page.getByText('64°C')).toBeVisible();
  await expect(page.getByText('מהקהילה')).toBeVisible();
});

test('user can navigate back from a cut without leaving the site', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'כל חומרי הגלם' })).toBeVisible();

  const openPargit = async () => {
    const poultryGroup = page.locator('.catalog-groups details').filter({ hasText: 'עוף' });
    await poultryGroup.locator('summary').click();
    await poultryGroup.getByRole('button', { name: 'פרגית' }).click();
    await expect(page.getByText('פרגית').first()).toBeVisible();
  };

  // in-app back button returns to the catalog
  await openPargit();
  await page.getByRole('button', { name: /חזרה לכל חומרי הגלם/ }).click();
  await expect(page.getByRole('heading', { name: 'כל חומרי הגלם' })).toBeVisible();

  // the browser BACK button also returns to the catalog (does not leave the site)
  await openPargit();
  await page.goBack();
  await expect(page.getByRole('heading', { name: 'כל חומרי הגלם' })).toBeVisible();

  // clicking the SuVid wordmark also goes home
  await openPargit();
  await page.getByRole('button', { name: 'חזרה לדף הבית' }).click();
  await expect(page.getByRole('heading', { name: 'כל חומרי הגלם' })).toBeVisible();
});

test('user can switch between preparation direction tabs', async ({ page }) => {
  await page.goto('/');
  await page.locator('input').first().fill('אנטריקוט');
  await page.locator('form.search button[type="submit"]').click();

  await expect(page.getByRole('heading', { name: 'כיווני הכנה' })).toBeVisible();
  const tabs = page.locator('.direction-tabs .dir-tab');
  await expect(tabs).toHaveCount(3);

  // switching to the chimichurri direction changes the visible recipe
  await page.getByRole('tab', { name: 'עם צ׳ימיצ׳ורי' }).click();
  await expect(page.locator('.recommendations .panel h3')).toHaveText('עם צ׳ימיצ׳ורי');
  await expect(page.getByText(/צ׳ימיצ׳ורי נדיב/)).toBeVisible();
});

test('mobile user gets clarification for ambiguous ribs search', async ({ page }) => {
  await page.goto('/');

  await page.locator('input').first().fill('צלעות');
  await page.locator('form.search button[type="submit"]').click();

  await expect(page.locator('.choice-list')).toBeVisible();
  await page.locator('.choice-list button').filter({ hasText: 'טלה' }).click();

  await expect(page.getByText(/56.*C/)).toBeVisible();
  await expect(page.locator('.metrics strong').filter({ hasText: /^2\b/ })).toBeVisible();
});

test('mobile user can browse the catalog and choose pargit', async ({ page }) => {
  await page.goto('/');

  const poultryGroup = page.locator('.catalog-groups details').filter({ hasText: 'עוף' });
  await poultryGroup.locator('summary').click();
  await poultryGroup.getByRole('button', { name: 'פרגית' }).click();

  await expect(page.getByText('פרגית').first()).toBeVisible();
  await expect(page.getByText(/74.*C/)).toBeVisible();
  await expect(page.locator('.metrics strong').filter({ hasText: /^1\.5\b/ })).toBeVisible();
});

test('mobile layout keeps the compact time picker in hour then minutes order', async ({ page }) => {
  await page.goto('/');

  await page.locator('input').first().fill('פרגית');
  await page.locator('form.search button[type="submit"]').click();

  await expect(page.locator('.ready-panel')).toBeVisible();
  const hourBox = await page.locator('.compact-time-row select').first().boundingBox();
  const minuteBox = await page.locator('.compact-time-row select').last().boundingBox();
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const viewportWidth = page.viewportSize()?.width ?? 0;

  expect(hourBox).not.toBeNull();
  expect(minuteBox).not.toBeNull();
  expect(hourBox!.x).toBeLessThan(minuteBox!.x);
  expect(scrollWidth).toBeLessThanOrEqual(viewportWidth);
});
