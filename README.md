# CV Spruce 🌲

## Project Info

Welcome to **CV Spruce** (formerly Precision CV)! 🎯

This isn't just another CV tool; it's your personal career wingman powered by the cutting-edge **Gemini 2.5 Flash**, **Claude 3.5 Sonnet**, and **GPT-4o** models.

Our intention? To stop you from tearing your hair out over formatting and keyword matching. We take your existing CV and a job description, mix them together with a little AI magic, and produce a tailored masterpiece that screams "HIRE ME!"

## Features ✨

*   **Multi-Model Support**: Choose between Google Gemini, Anthropic Claude, and OpenAI GPT-4o for your optimizations.
*   **Smart Job Specification Input**:
    *   Paste text directly.
    *   Upload a file (PDF, DOCX, TXT).
    *   Fetch directly from a URL.
*   **CV Parsing**: Upload your current CV in PDF or DOCX format.
*   **Tailored Optimization**:
    *   **Keywords**: Add specific keywords you want to target.
    *   **Style**: Choose between **Precision** (match spec), **Ruthless** (cut fluff), or **Ambitious** (push boundaries).
    *   **Cover Letter**: Generate Quick, Formal, or Detailed cover letters.
*   **Flexible Workloads**:
    *   **Normal**: Full analysis, CV, Cover Letter, Q&A, and Industry Insights.
    *   **Reduced**: Analysis, CV, and Cover Letter.
    *   **Minimal**: Analysis and CV only (fastest).
*   **Local Privacy**: Your API keys and CV data are stored in your browser's local storage (if you choose) and are never sent to our servers, only directly to the AI providers.

## How can I use this myself?

You have a few options to get started with CV Spruce:

### 1. Use it as is!
Simply open the application in your browser and start optimizing your CV immediately. Your API key is stored locally in your session (or local storage if saved), so your data remains private.

### 2. Fork it & Customize 🍴
Want to add your own flair? Feel free to fork this repository! We love open source. If you build something cool or fix a bug, please **submit a Pull Request**. We'd love to see what you create!

### 3. Self-Host 🏠
Prefer to run it on your own machine? No problem!

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

#### Configuration

To run the application, you will need an API Key from one of the supported providers:
*   [Google Gemini API Key](https://aistudio.google.com/)
*   [Anthropic Claude API Key](https://console.anthropic.com/)
*   [OpenAI API Key](https://platform.openai.com/)

You can enter these keys directly in the application UI. You can choose to save them to your browser's local storage for convenience, or enter them each time for maximum security.

#### Installation

Follow these steps:

```sh
# Step 1: Clone the repository.
git clone https://github.com/harrydbarnes/cv-spruce.git

# Step 2: Navigate to the project directory.
cd cv-spruce

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Verify API Key Storage (Optional)
# This script verifies that the API key storage UI works correctly.
# Requires python and playwright.
pip install playwright
playwright install
python verify_api_key.py

# Step 5: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## What technologies are used for this project? 🛠️

This project is a modern web application built with a robust tech stack:

- **[Vite](https://vitejs.dev/)**: The build tool that makes development lightning fast.
- **[React](https://react.dev/)**: The library for building our user interface.
- **[TypeScript](https://www.typescriptlang.org/)**: For type-safe, robust code.
- **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first CSS framework for styling.
- **[shadcn/ui](https://ui.shadcn.com/)**: Beautifully designed, accessible components.
- **[Framer Motion](https://www.framer.com/motion/)**: For smooth, declarative animations.
- **[PDF.js](https://mozilla.github.io/pdf.js/) & [Mammoth.js](https://github.com/mwilliamson/mammoth.js)**: For client-side document parsing (PDF & DOCX).
- **[Sonner](https://sonner.emilkowal.ski/)**: An opinionated toast component for React.
- **Client-Side AI**: Direct integration with Gemini, Claude, and OpenAI APIs from the browser.

## Deployment 🚀

You can deploy this project using any static site hosting service like Vercel, Netlify, or GitHub Pages.

Happy optimizing! ✨
