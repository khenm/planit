# Contributing to PlanIt

First off, thanks for taking the time to contribute! 🎉

We want to make PlanIt the best desktop companion for Notion users. Whether you're fixing a bug, improving the docs, or adding a new feature, your help is welcome.

## 📂 Project Structure

PlanIt is a [Tauri](https://tauri.app/) application, meaning it has two distinct parts:

- **Frontend (`/src`)**: A React application built with Vite and TypeScript.
  - `src/components`: Reusable UI components (TaskCard, Settings, etc.).
  - `src/App.tsx`: The main entry point and layout.
  - `src/index.css`: Global styles and Tailwind directives.

- **Backend (`/src-tauri`)**: The Rust core that handles system interactions and data syncing.
  - `src-tauri/src/main.rs`: The entry point for the Rust backend.
  - `src-tauri/src/lib.rs`: Shared library logic.
  - `src-tauri/tauri.conf.json`: Tauri configuration (windows, icons, permissions).

## 🎨 Code Style

We enforce code style to keep the codebase clean and consistent.

### Frontend (React/TypeScript)
- We use **Prettier** for formatting.
- Please run `npm run format` (if available) or ensure your editor is configured to format on save.
- Naming: PascalCase for components (`TaskCard.tsx`), camelCase for functions/vars.

### Backend (Rust)
- We use **cargo fmt**.
- **Must** run `cargo fmt` inside `src-tauri/` before committing.
- Follow standard Rust conventions (snake_case for variables/functions).

## 🛠 Workflow & Pull Requests

1. **Fork** the repository.
2. **Clone** your fork locally.
3. **Create a Branch** for your change:
   ```bash
   git checkout -b feature/my-new-feature
   # or
   git checkout -b fix/issue-description
   ```
4. **Make sure it builds**:
   - Frontend: `npm run dev`
   - Backend: `npm run tauri dev`
5. **Commit** your changes with meaningful messages:
   - ✅ Good: "Fix task date parsing error in TaskCard"
   - ❌ Bad: "fix bug"
6. **Push** to your fork and open a **Pull Request**.

## 🐛 Reporting Bugs & Features

We use GitHub Issues to track bugs and features.
- Check if the issue already exists.
- Use the **Bug Report** template for bugs.
- Use the **Feature Request** template for new ideas.

Happy Coding! 🚀
