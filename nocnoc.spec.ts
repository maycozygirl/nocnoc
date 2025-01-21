const { test, expect } = require('@playwright/test');

test('Scenario 1 :User searches a random string', async ({ page }) => {
  await page.goto('https://nocnoc.com/pl/All?area=search&st=%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%97%E0%B8%B3%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B8%AD%E0%B8%B8%E0%B9%88%E0%B8%99'); 

  // Given :  User is click on the search bar And user enter a random string into the search field.
  const searchInput = page.locator('#search-suggestion-input');
  await expect(searchInput).toBeVisible();
  const randomString = ';';
  await searchInput.fill(randomString);

  // When :	The user clicks on the search button or presses "Enter" to submit
  await searchInput.press('Enter'); 

  // Then : The system displays a message  "Nothing Matches Your Search" And The system does not crash during the search process.
  const noResultsMessage = page.locator('p.bu-text-semantic-gray-neutral-fg-mid-on-white');
  await noResultsMessage.waitFor({ timeout: 10000 }); // Wait for up to 10 seconds

  const isVisible = await noResultsMessage.isVisible();
  if (isVisible) {
    console.log('No results message displayed as expected:', await noResultsMessage.textContent());
  } else {
    throw new Error('No results message not displayed as expected.');
  }
});

test('Scenario 2 :User is using a mobile phone to access the website', async ({ page }) => {
  // Given: User open web browser in mobile or another device. And the user navigate to the application's web page
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('https://nocnoc.com/pl/All?area=search&st=%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%97%E0%B8%B3%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B8%AD%E0%B8%B8%E0%B9%88%E0%B8%99');

  // When: The user accesses the search page. And user enterstring into the search field. And The user clicks on the search button or presses "Enter" to submit
  const searchInput = page.locator('#search-suggestion-input');
  await expect(searchInput).toBeVisible();
  const string = 'เครื่องทำน้ำอุ่น';
  await searchInput.fill(string);
  await searchInput.press('Enter');

  // Then: The system displays the search results. And The system does not crash during the search process.
  const searchResults = page.locator('.product-list');
  await searchResults.waitFor({ timeout: 50000 }); 

});

test('Scenario 3: User wants to change language', async ({ page }) => {
  // Given: User is on the search page and wants to change the language
  await page.goto('https://nocnoc.com/pl/All?area=search&st=%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%97%E0%B8%B3%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B8%AD%E0%B8%B8%E0%B9%88%E0%B8%99'); 

  // When: User clicks on the language button to change the language
  const languageButton = page.locator('div[data-testid="language-btn"]');
  await languageButton.waitFor({ timeout: 5000 }); // Adjust timeout if needed
  
  if (await languageButton.isVisible()) {
    await languageButton.click();
  } else {
    throw new Error('Language change button not visible.');
  }

  // And click on the English flag image
  const englishFlag = page.locator('img[alt="EN"]');
  await englishFlag.click();
  
  // Then: The system updates the website to the English language
  const languageText = page.locator('h1.bu-typography-heading-3');
  await languageText.waitFor({ timeout: 30000 });

  const englishSpecificText = page.locator('text=Results for');
  await englishSpecificText.waitFor({ timeout: 30000 });
});

test('Scenario 5: Receiving a Search Link from Another User', async ({ page }) => {
  // Given: The user has received a search link from another user that contains a search query parameter "เครื่องทำน้ำอุ่น"
  const searchQuery = 'เครื่องทำน้ำอุ่น';
  const searchLink = 'https://nocnoc.com/pl/All?area=search&st=%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%97%E0%B8%B3%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B8%AD%E0%B8%B8%E0%B9%88%E0%B8%99';

  // When: The user accesses the search link
  await page.goto(searchLink);

  // Then: Ensure the page has loaded completely
  const searchResults = page.locator('.product-list');
  await searchResults.waitFor({ state: 'visible', timeout: 60000 }); // Wait until the product list is visible

  // And: Ensure the search results contain the expected search query
  const productText = page.locator('.product-list:has-text("เครื่องทำน้ำอุ่น")'); // Search within product list
  await expect(productText).toBeVisible(); // Verify visibility of the text
});



