# CV Spruce 🌲

## Project Info

Welcome to **CV Spruce** (formerly Precision CV)! 🎯

This isn't just another CV tool; it's your personal career wingman powered by the cutting-edge **Gemini 2.5 Flash API**.

Our intention? To stop you from tearing your hair out over formatting and keyword matching. We take your existing CV and a job description, mix them together with a little AI magic, and produce a tailored masterpiece that screams "HIRE ME!"

Whether you need to match a job spec with surgical **Precision**, cut the fluff with **Ruthless** efficiency, or show off your potential with an **Ambitious** rewrite, we've got you covered.

## How can I use this myself?

You have a few options to get started with CV Spruce:

### 1. Use it as is!
Simply open the application in your browser and start optimizing your CV immediately. Your API key is stored locally in your session, so your data remains private.

### 2. Fork it & Customize 🍴
Want to add your own flair? Feel free to fork this repository! We love open source. If you build something cool or fix a bug, please **submit a Pull Request**. We'd love to see what you create!

### 3. Self-Host 🏠
Prefer to run it on your own machine? No problem!

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

#### Configuration

To run the application, you will need a Google Gemini API Key.
1. Go to [Google AI Studio](https://aistudio.google.com/).
2. Create a new API Key.
3. You can either enter this key in the UI every time you use the app, or configure it in your environment for development.

A `.env.example` file is provided to show the required environment variables.
```sh
cp .env.example .env
# Edit .env and add your VITE_GEMINI_API_KEY
```

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

- **[Vite](https://vitejs.dev/)**: The build tool that makes development lightning fast. It handles our dev server and bundling.
- **[React](https://react.dev/)**: The library for building our user interface. It lets us create reusable components like the Tailor Section and Results Display.
- **[TypeScript](https://www.typescriptlang.org/)**: Adds static typing to JavaScript, helping us catch errors early and making the code more robust (and easier to read!).
- **[Tailwind CSS](https://tailwindcss.com/)**: A utility-first CSS framework that allows us to style components quickly and consistently directly in our markup.
- **[shadcn/ui](https://ui.shadcn.com/)**: A collection of beautifully designed, accessible, and customizable components that we've used to build the UI foundation.
- **[Gemini API](https://ai.google.dev/)**: The brains of the operation! We use the Gemini 2.5 Flash model directly from the client-side to process your CV and Job Spec. No backend server required for the AI logic!

## Deployment 🚀

You can deploy this project using any static site hosting service like Vercel, Netlify, or GitHub Pages.

Happy optimizing! ✨
