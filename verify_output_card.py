import time
from playwright.sync_api import sync_playwright, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # 1. Navigate to the page
        print("Navigating to app...")
        page.goto("http://localhost:8080/precisioncv/")

        # 2. Wait for the API Key section to be visible
        print("Waiting for API Key input...")
        api_key_input = page.get_by_label("Gemini API Key")
        expect(api_key_input).to_be_visible()

        # 3. Enter dummy key
        api_key_input.fill("dummy-key")

        # 4. Check Job Spec input
        print("Checking Job Spec input...")
        job_spec_input = page.get_by_placeholder("Paste the job specification here...")
        expect(job_spec_input).to_be_visible()
        job_spec_input.fill("Software Engineer job spec")

        # 5. Check Keywords input
        print("Checking Keywords input...")
        keywords_input = page.get_by_placeholder("Enter keywords to include in your CV...")
        expect(keywords_input).to_be_visible()
        keywords_input.fill("React, TypeScript")

        # 6. Check Generate Button (should be disabled because CV is missing)
        generate_button = page.get_by_role("button", name="Generate")
        expect(generate_button).to_be_disabled()

        # Take a screenshot to confirm UI looks normal
        page.screenshot(path="/home/jules/verification/app_loaded.png")
        print("App loaded and verified.")

        browser.close()

if __name__ == "__main__":
    run()
