# AEM Boilerplate Xwalk - Copilot Instructions

## Project Overview
This repository provides a boilerplate for Adobe Experience Manager (AEM) projects, focusing on Edge Delivery and authoring workflows. It is intended to accelerate development with best practices and a standardized setup.

Key features:
- Template project for rapid development on AEM Edge Delivery.
- Includes baseline configs, common blocks, models, and integrations.
- Designed for seamless authoring and site performance optimizations.

### Environments
- **Preview:** `https://main--{repo}--{owner}.aem.page/`
- **Live:** `https://main--{repo}--{owner}.aem.live/`

## Tech Stack
- **Node.js:** 18.3.x or newer required.
- **AEM Cloud Service:** Release 2024.8 or newer (>= `17465`).
- **JavaScript/TypeScript** for scripting and build automation (`scripts/`, `package.json`).
- **YAML & JSON:** Configuration and content modeling (`fstab.yaml`, `component-definition.json`, `component-models.json`, etc).
- **HTML/CSS:** Markup layouts and styles are provided in `404.html`, `head.html`, `styles/`.
- **Tooling:** Linters (`.eslintrc.js`, `.stylelintrc.json`), Renovate, Husky for git hooks, and AEM CLI integration.

## Repository Structure
- `blocks/` : Commonly used content/functional blocks for AEM projects.
- `models/` : Data models defining content structure, typically in JSON.
- `icons/`, `fonts/` : Static assets (SVGs, icon sets, fonts).
- `scripts/` : Utility scripts for automation, builds, and developer tasks.
- `styles/` : CSSS and styling assets.
- `tools/` : Additional utilities and project helpers.
- `.github/` : GitHub workflows, actions and community standards (`CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`).
- Config files : `.editorconfig`, `.eslintrc.js`, `.hlxignore`, `.renovaterc.json`, `.stylelintrc.json`, `.gitignore`.
- Entry points & configs: `fstab.yaml`, `package.json`, `package-lock.json`, `component-definition.json`, `component-filters.json`, `paths.json`.

## Coding Guidelines
- Follow JavaScript/Node.js best practices, linting with ESLint and Stylelint (see config files for rules).
- Ignore files/directories as specified in `.eslintignore`, `.hlxignore`, and `.gitignore`.
- Use AEM-specific content modeling conventions as described in [official docs](https://www.aem.live/docs/) and [Experience League](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/edge-delivery/wysiwyg-authoring/authoring).
- All blocks, models, and scripts should be maintainable and documented for team use.
- Contribution guidelines and community standards are defined in `.github/`.
- Automated dependency updates via Renovate.

## Project Resources & Automation
- **Scripts:** Use scripts in `scripts/` for setup, linting, and other tasks.
- **AEM CLI:** Install globally with `npm install -g @adobe/aem-cli` for local preview, proxy, and deployments.
- **Code Sync:** Integrate AEM Code Sync GitHub app for workflow automation.

## Best Practices for Copilot
- Always use relevant AEM APIs, file conventions and follow existing data model schemas.
- When creating new blocks, reference content models in `models/` and configs in root JSON/YAML files.
- Prioritize performance, clarity and maintain authoring consistency.
- Consult the documentation links in `README.md` and follow specified tutorials for best results.
- Use linting (`npm run lint`) and style guides before PR submission.

## References
- [AEM Live Docs](https://www.aem.live/docs/)
- [Experience League](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/edge-delivery/wysiwyg-authoring/authoring)
- [AEM CLI](https://github.com/adobe/helix-cli)

---
_Structure, tools and conventions summarized from repository contents and README. Adapt/extend as your team workflow evolves._
