const { remote } = require('webdriverio');
const assert = require('assert');

describe('Amazon Basics Test', () => {
    let browser;

    let priceText;

    before(async () => {
        // Initialize WebDriver
        browser = await remote({
            capabilities: {
                browserName: 'chrome'
            }
        });
    });

    after(async () => {
        // Close the browser
        if (browser) {
            await browser.deleteSession();
        }
    });

    it('should navigate to https://www.amazon.com/', async () => {
        await browser.url('https://www.amazon.com/');
        console.log("1. Navigate to https://www.amazon.com/");
    });

    it('should search for "amazon basics"', async () => {
        // Wait for the page to load
        await browser.pause(10000);
        // Search "amazon basics" in the search box
        const searchInput = await browser.$('#twotabsearchtextbox');
        await searchInput.setValue('amazon basics');
        const searchButton = await browser.$('#nav-search-submit-button');
        await searchButton.click();
        console.log("2. Search for 'amazon basics'");
    });

    it('should verify search results', async () => {
        // Wait for the search results to load
        await browser.pause(5000);
        // Verify that the results for "amazon basics" are displayed on the top of the page
        const searchResultsText = await browser.$('.a-color-state.a-text-bold');
        await searchResultsText.waitForExist();
        const text = await searchResultsText.getText();
        assert.ok(text.includes('amazon basics'), "Search results for 'amazon basics' are not displayed on the top of the page below the menu bar.");
        console.log("3. Verify search results");
    });

    it('should select Amazon Brands checkbox', async () => {
        // Select "Amazon Brands" checkbox
        const checkbox = await browser.$('li[aria-label="Amazon Brands"] .a-checkbox-fancy');
        await checkbox.scrollIntoView();
        await checkbox.click();
        await browser.pause(5000);
        console.log("4. Select 'Amazon Brands' checkbox");
    });

    it('should click on Amazon-Basics-Freezer-Gallon-Count product', async () => {
        // Click on an Amazon Basics product
        const priceElement = await browser.$('.a-offscreen');
        priceText = await priceElement.getText();
        // price = float(price_text.replace("$", ""))
        const productLink = await browser.$('a[href*="/Amazon-Basics-Freezer-Gallon-Count/dp/B093WPZF1Y"]');
        await productLink.click();
        console.log("5. Click on an Amazon Basics product");
    });

    it('should verify selected size', async () => {
        // Wait for the product page to load
        const productTitle = await browser.$('#productTitle');
        await productTitle.waitForExist();
        // Verify that "Gallon (90 Count)" is selected under 'Size' section
        const selectedSize = await browser.$('//span[@class="selection"]');
        const expectedSize = "Gallon (90 Count)";
        const actualSize = await selectedSize.getText();
        assert.strictEqual(actualSize, expectedSize, `Expected size: '${expectedSize}', Actual size: '${actualSize}'`);
        console.log("6. Verify selected size:", actualSize);
    });

    it('should add the product to the cart', async () => {
        // Click on "Add to Cart" button
        const addToCartButton = await browser.$('#add-to-cart-button');
        await addToCartButton.click();
        await browser.pause(5000);
        console.log("7. Add the product to the cart");
    });

    it('should navigate to the cart', async () => {
        // Navigate to the cart
        const goToCartButton = await browser.$('//a[@href="/cart?ref_=sw_gtc"]');
        await goToCartButton.click();
        await browser.waitUntil(async () => {
            const subtotalElement = await browser.$('#sc-subtotal-amount-activecart');
            return await subtotalElement.isDisplayed();
        });
        console.log("8. Navigate to the cart");
    });

    it('should verify the subtotal', async () => {
    // Verify the subtotal
    const subtotalElement = await browser.$('#sc-subtotal-amount-activecart');
    const subtotalText = await subtotalElement.getText();
    assert.ok(subtotalText.includes(priceText), `Expected subtotal: '${priceText}', Actual subtotal: '${subtotalText}'`);
    console.log("9. Verify the subtotal:", subtotalText);
});
});
