# Copilot Instructions — calc-x

## Workflow

- When asked to "ship", "push", "run source control", "run QA", or "wrap up" after making code changes, **always invoke the `pr-pipeline` skill end-to-end** starting from the current feature branch.
- Do not treat "push" or "source control" as only meaning `git push` — it means the full pipeline.

## Branch Naming

Allowed prefixes targeting `develop`: `feature/`, `fix/`, `chore/`, `docs/`, `agents/`
Allowed prefixes targeting `main` directly: `hotfix/` only

## Commit Messages

All commits must follow Conventional Commits: `<type>(<scope>): <description>`
All commits must include the trailer: `Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>`

## Merging

Never merge directly to `main` or `stage`. All merges flow: `feature → develop → stage → main` via PRs.
