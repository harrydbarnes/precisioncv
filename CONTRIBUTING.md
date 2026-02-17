# Contributing to CV Spruce

First off, thanks for taking the time to contribute! 🎉

CV Spruce is an open-source project, and we love receiving contributions from our community — you! There are many ways to contribute, from writing tutorials or blog posts, improving the documentation, submitting bug reports and feature requests, or writing code which can be incorporated into CV Spruce itself.

## Getting Started

1.  **Fork the repository** on GitHub.
2.  **Clone your fork** locally:
    ```bash
git clone https://github.com/harrydbarnes/cv-spruce.git
    cd precisioncv
    ```
3.  **Install dependencies**:
    ```bash
    npm install
    ```
4.  **Create a branch** for your contribution:
    ```bash
    git checkout -b feat/your-feature-name
    # or
    git checkout -b fix/your-bug-fix
    ```
5.  **Start the development server**:
    ```bash
    npm run dev
    ```

## Reporting Bugs

If you find a bug, please create a new issue using the **Bug Report** template.

**Please include:**
*   A clear and descriptive title.
*   Steps to reproduce the issue.
*   Expected behavior vs. actual behavior.
*   Screenshots or GIFs if applicable.
*   Browser and OS version.

## Requesting Features

Have an idea for a new feature? We'd love to hear it! Please use the **Feature Request** template.

**Please include:**
*   A clear and descriptive title.
*   The problem you are trying to solve.
*   Your proposed solution.
*   Any alternatives you've considered.

## Submitting Pull Requests

1.  Ensure your code follows the existing style and conventions.
2.  Write clear, concise commit messages.
3.  Push your changes to your fork.
4.  Submit a Pull Request (PR) to the `main` branch of the original repository.
5.  Fill out the PR description template (if available) or describe your changes clearly.

### Branch Naming Convention

*   `feat/...`: New features or enhancements.
*   `fix/...`: Bug fixes.
*   `docs/...`: Documentation updates.
*   `chore/...`: Maintenance tasks, dependencies, etc.
*   `test/...`: Adding or updating tests.

### Code Style

*   We use **Prettier** for code formatting.
*   We use **ESLint** for linting.
*   Please run `npm run lint` before submitting your PR to catch any issues.

## Testing

Please ensure that you add tests for any new logic you introduce. Run existing tests to ensure no regressions:

```bash
npm test
```

Thank you for your contributions! 🌲
