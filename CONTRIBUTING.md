# Contributing to Dashboard Capsule AI

Thank you for your interest in contributing to **Dashboard Capsule AI**! This guide outlines our architecture standards, branching model, code formatting, and pull request workflow.

---

## 📌 Development Workflow & Branching Strategy

We follow **Trunk-Based Development** with short-lived feature branches:

- `main`: Protected production branch. All merged code must pass CI/CD checks.
- `feature/<issue-id>-<description>`: Feature development branches (lifecycle < 48 hours).
- `fix/<issue-id>-<description>`: Bug fix and hotfix branches.

---

## 📝 Conventional Commit Messages

Commits must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat(scope)`: A new user-facing feature or API endpoint
- `fix(scope)`: A bug fix
- `docs(scope)`: Documentation update
- `refactor(scope)`: Code changes that neither fix a bug nor add a feature
- `perf(scope)`: Performance optimization
- `test(scope)`: Adding or updating unit/integration tests

**Example Commit Message**:
```bash
git commit -m "feat(capsule-builder): implement ECDSA P-384 binary signature validation"
```

---

## 🛠 Local Setup & Pull Request Process

1. **Fork & Clone**:
   ```bash
   git clone https://github.com/VenkataKarthikeya-eng/dashboard-capsule-ai.git
   cd dashboard-capsule-ai
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Verify Build & Typecheck**:
   ```bash
   npm run build
   ```

4. **Submit Pull Request**:
   - Ensure all 11 Turborepo build tasks pass without TypeScript or Next.js errors.
   - Maintain zero broken links and complete docstrings.
