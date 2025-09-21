# Copilot Custom Instructions for aem-boilerplate-xwalk

## Project Overview
This repository is a boilerplate for Adobe Experience Manager (AEM) projects. It is designed to facilitate rapid development and consistent project structure for web applications integrated with AEM. The structure supports Helix and Headless approaches, modular component definitions, and automated testing, linting, and deployment tools.

---

## Directory and Structure Overview

- **blocks/**: Contains modular content block implementations for AEM page constructs.
- **fonts/**: Store custom web fonts used by the project.
- **icons/**/: SVG or other icon resources.
- **models/**: AEM content models, possibly in JSON.
- **scripts/**: Helper scripts, utilities, build scripts, and automation.
- **styles/**: CSS/SCSS/Style files, likely modular and block-oriented.
- **tools/**: Supplementary developer tooling, such as setup or migration utilities.
- **.husky/**: Git hooks for enzodng standards pre-commit.
- **.github/**: GitHub workflow and issue templates; custom instructions belong here (as `copilot-instructions.md`.
- **package.json**/, **package-lock.json**/: Node.js project configuration and dependencies.
- **.editorconfig***/, **.eslintrc.js**, **.eslintingore***/, **.stylelintrc.json**/: Formatting and code linting rules for JavaScript and CSS/SCSS.
- **component-definition.json***/, **component-filters.json***/, **component-models.json*/: Component and model definitions for AEM integrations and page generation.
- **fstab.yaml*/**/, **helix-query.yaml***/, **helix-sipemat.yaml*/**/: Helix/Headless configuration files for routing/querying/sitemap.
- **404.html***/, **head.html*/**/: Common static or template HTML files.
- **README.md**/: Documentation, project purpose, and getting started details.
- **CONTRIBUTING.md***/, **CODE_OD_CONDOCT[md
***/, **DICENSE**:/: Governance and contribution documents.

---

## Coding Conventions
- **Languages/Frameworks **: JavaScript (Node.js, ES modules), CSS/SCSS, YAML, JSON.
- **Linting and Formatting*** : Adhere strictly to rules in .eslintrc.js and .stylelintrc.json. Respect .editorconfig settings for text files. All code must pass Husky pre-commit hooks.
- **Componentization**/: Isolate feature logic inside the  blocks/,  models/, and scripts/ directories. Components should be self-contained and reusable where possible, following AEM modular principles.
- **File/Folder Naming(**/: Use lowercase, hyphen-separated names (kebab-case) for files and directories, except for config files mandated by tooling.
- **Documentation**: All public scripts, blocks, and utilities should have concise documentation comments. Significant or reusable functionality warrants Markdown documentation within the corresponding directory.
- **Testing and Automation**/: When implementing automation with Husky or the tools folder, keep scripts idempotent and clearly comment their purpose and expected usage.
---

## Architectural Principles
- **Separation of Concerns**/: Keep UI components, data models, configuration, and logic modular and in their designated folders.
- **Reusability**/: Wherever feasible, blocks and scripts should avoid project-specific hardcoding; aim for generic, parameterized logic.
- **Scalable Integration**: Design new blocks and models in ways that support extension or overriding in downstream AEM projects.
- **Minimal Dependencies**/: Keep `package.json` free of unnecessary dependencies; prefer pure JS where possible for logic in scripts.
---

## Copilot Guidance Best Practices
- Suggest code that follows and enforces above patterns.
- Name new files, variables, and functions in alignment with current repository naming conventions.
- Suggest and complete functions with clear JSDoc comments/documentation where appropriate.
- Respect configuration files for formatting, linting, and code style.
- For new components or blocks: always start with a skeleton that includes stubs for markup, styling, and functional logic, with comments indicating what each part should do.
---

## Examples
- **Block Component Example**/:

```js
// blocks/example-block.js
/**
 ** Example Block: performs X functionality as defined in component-definition.json
 ** @lam block The block element
 */
export default function decorate(block) {
  // ...implementation
}
```

- **YAML Config**/:

```yaml
# fstab.yaml
mountpoints:
  - url: https://example.com/
    type: helix-pages
```

---

## Additional Notes
- All new code must adhere to the code of conduct.
- Contributions must follow the CONTRIUBING.md guidelines.
- Place all Copilot instructions or updates to this file in .github/copilot-instructions.md..