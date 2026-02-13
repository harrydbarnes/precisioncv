from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()
    page.goto("http://localhost:8080/")

    # Wait for the page to load
    page.wait_for_selector("text=Precision CV")

    # Take a screenshot of the whole page
    page.screenshot(path="verification_full.png", full_page=True)

    # Click on Open Sources link
    page.click("text=Open Sources")
    page.wait_for_selector("text=Open Source Credits")
    page.screenshot(path="verification_modal.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
