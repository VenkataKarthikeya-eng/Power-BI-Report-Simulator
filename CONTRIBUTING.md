# Contribution & Development Standards

## Branching Strategy
We strictly adhere to Trunk-Based Development:
- `main`: Production-ready branch. Protected.
- `staging`: Pre-production validation environment.
- `feature/<issue-id>-short-desc`: Feature branches (must be short-lived < 48 hours).
- `fix/<issue-id>-short-desc`: Hotfix branches.

## Conventional Commit Standards
All commits must follow Conventional Commit specification:
- `feat(scope)`: New feature addition
- `fix(scope)`: Bug fix
- `docs(scope)`: Documentation update
- `refactor(scope)`: Code refactoring without behavior change
- `sec(scope)`: Security fix or certificate update

Example:
```bash
git commit -m "feat(capsule-builder): add ECDSA P-384 signature compiler module"
```

## Pull Request Guidelines
1. Ensure all tests pass (`npm run test`).
2. Ensure TypeScript typechecking passes (`npm run lint`).
3. Maintain zero broken imports and no lint errors.
