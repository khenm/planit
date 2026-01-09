# Contributing to PlanIt

Thank you for your interest in contributing to PlanIt! Our community is open to everyone and welcomes all kinds of contributions, no matter how small or large. There are several ways you can contribute to the project:

- Identify and report any issues or bugs.
- Suggest or implement new features.
- Help translate PlanIt into new languages.
- Improve documentation or contribute a how-to guide.

We also believe in the power of community support; thus, answering queries, offering PR reviews, and assisting others are also highly regarded and beneficial contributions.

Finally, one of the most impactful ways to support us is by raising awareness about PlanIt. Talk about it in your blog posts, express your support on social media, or simply offer your appreciation by starring our repository!

## Job Board

Unsure on where to start? Check out our [Issues page](https://github.com/phuongoliver/planit/tree/main/.github/issue) for tasks to work on.

- **Found a bug?** [Open a Bug Report](https://github.com/phuongoliver/planit/tree/main/.github/issue/bug_report.md)
- **Have a feature idea?** [Open a Feature Request](https://github.com/phuongoliver/planit/tree/main/.github/issue/feature_request.md)
- **Want to translate PlanIt?** [Start a new Language Translation](https://github.com/phuongoliver/planit/tree/main/.github/issue/new_language.md)

## License

See [LICENSE](LICENSE).

## Developing

The first step of contributing to PlanIt is to clone the GitHub repository:

```bash
git clone https://github.com/phuongoliver/planit.git
cd planit
```

Then, ensure you have the necessary environment set up:

- **Node.js** (v16+)
- **Rust** (stable)

### Installation

Install the frontend dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run tauri dev
```

### Linting & Formatting

PlanIt enforces code style to keep the codebase clean and consistent.

**Frontend (React/TypeScript):**
We use Prettier. Please ensure your editor is configured to format on save, or run:

```bash
npm run format
```

**Backend (Rust):**
We use standard Rust formatting. You **must** run this inside `src-tauri/` before committing:

```bash
cd src-tauri
cargo fmt
```

## Testing

Before submitting a PR, ensure the application builds successfully:

```bash
# Frontend build check
npm run build

# Backend check
npm run tauri build -- --debug
```

## Documentation

Documentation source files are written in Markdown (like this one!). If you are adding a new feature that changes the user experience, please update the `README.md` or relevant guides.

## Issues

If you encounter a bug or have a feature request, please search existing issues first to see if it has already been reported. If not, please file a new issue, providing as much relevant information as possible.

**Important:** If you discover a security vulnerability, please do not open a public issue. Contact the maintainers directly.

## Pull Requests & Code Reviews

Thank you for your contribution to PlanIt! Before submitting the pull request, please ensure the PR meets the following criteria.

### DCO and Signed-off-by

When contributing changes to this project, you must agree to the Developer Certificate of Origin (DCO). Commits must include a `Signed-off-by:` header.

Using `-s` with `git commit` will automatically add this header:

```bash
git commit -s -m "Your commit message"
```

### PR Title and Classification

Only specific types of PRs will be reviewed. The PR title should be prefixed appropriately to indicate the type of change:

- `[Fix]` for bug fixes.
- `[Feat]` for new features.
- `[UI]` for visual changes or component updates.
- `[Backend]` for Rust/Tauri logic changes.
- `[Docs]` for documentation fixes and improvements.
- `[i18n]` for translation additions or updates.
- `[CI]` for build or continuous integration improvements.
- `[Refactor]` for code cleanup without behavior changes.

### Code Quality

The PR needs to meet the following code quality standards:

- Pass all linter checks (Prettier & cargo fmt).
- The code needs to be well-documented/readable.
- If the PR modifies user-facing behaviors, please add documentation.

### Notes for Large Changes

Please keep the changes as concise as possible. For major architectural changes, we would expect a GitHub issue discussing the technical design and justification first.

### What to Expect for the Reviews

The goal of the PlanIt team is to be transparent and efficient. However, we are a small team, so we need to prioritize some PRs over others.

- After the PR is submitted, it will be assigned to a reviewer.
- If the PR is not reviewed within 7 days, please feel free to ping the reviewer.
- Please respond to all comments within a reasonable time frame.

### Thank You

Finally, thank you for taking the time to read these guidelines and for your interest in contributing to PlanIt. All of your contributions help make PlanIt a great tool for everyone!
