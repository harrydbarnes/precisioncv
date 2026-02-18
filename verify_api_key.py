from playwright.sync_api import sync_playwright, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # 1. Navigate to the page
        page.goto("http://localhost:8080/cv-spruce/")

        # 2. Wait for the API Key section to be visible
        # Using a reliable locator for the API key input
        api_key_input = page.get_by_label("Gemini API Key")
        expect(api_key_input).to_be_visible()

        # 3. Check default state (Save Key = false)
        # Verify the text says "browser session"
        session_text = page.get_by_text("Your key is stored only in this browser session")
        expect(session_text).to_be_visible()

        # Take a screenshot of the default state
        page.screenshot(path="/home/jules/verification/api_key_default.png")
        print("Default state verified.")

        # 4. Toggle "Save API Key"
        save_switch = page.get_by_label("Save API Key")
        save_switch.click()

        # 5. Check updated state (Save Key = true)
        # Verify the text says "local storage"
        local_text = page.get_by_text("Your key is stored in your browser's local storage")
        expect(local_text).to_be_visible()

        # Take a screenshot of the saved state
        page.screenshot(path="/home/jules/verification/api_key_saved.png")
        print("Saved state verified.")

        browser.close()

if __name__ == "__main__":
    run()
