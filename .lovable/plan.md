

# CV Optimiser - AI-Powered Job Application Tool

## Overview
A single-page application that uses the Gemini 2.5 Flash API to help users optimise their CVs and prepare for job applications. Users provide their own API key, upload a CV, and supply a job specification to receive tailored output.

## Design & Theme
- **Neon yellow and green palette** inspired by Material Design 3 Expressive principles
- Smooth transitions and expressive motion physics on all interactions (hover, tab switches, card reveals)
- Fully responsive layout for desktop and mobile
- All copy in UK English spelling, no em dashes

## Page Sections

### 1. Header & Introduction
- App title and brief description of what it does
- Clean, vibrant hero area with the neon yellow/green branding

### 2. Input Section
- **Gemini API Key**: Password-masked input field (stored in browser session only)
- **CV Upload**: File input accepting .pdf, .docx, and .txt with client-side text extraction using pdf.js (via CDN) and mammoth.js (via CDN)
- **Job Specification**: Tabbed interface with three options:
  - Direct text input (textarea)
  - File upload (.pdf, .docx, .txt)
  - URL input with CORS proxy fetching (allorigins.win) and error handling
- **Generate button** to trigger the analysis

### 3. Loading State
- Animated spinner/skeleton cards with smooth fade-in transitions while text extraction and API calls are in progress

### 4. Output Section - Four Material Cards
Each card includes a "Copy to Clipboard" button and expressive reveal animations:

- **Tailored CV**: Rewritten CV aligned to the job specification
- **Cover Letter**: Professional email introduction tailored to the role
- **Interview Q&As**: 5 technical and behavioural questions with suggested answers
- **Industry Updates**: 5 recent trends and news items relevant to the role's industry

### 5. Error Handling
- Clear error messages for: invalid API key, failed file upload/parsing, failed URL scraping, malformed API responses

## Technical Approach
- Direct client-side calls to Gemini 2.5 Flash API using the user-provided key
- pdf.js and mammoth.js loaded via CDN for browser-based document parsing
- The exact system prompt provided will be used as `system_instruction` in the API call
- Structured JSON output parsed and displayed in the four card sections
- All processing happens in the browser with no backend required

