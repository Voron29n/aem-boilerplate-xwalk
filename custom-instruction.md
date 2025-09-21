# GitHub Copilot Custom Instructions for AEM XWalk Project

This is an Adobe Experience Manager (AEM) XWalk boilerplate project designed for Edge Delivery Services. The project enables WYSIWYG authoring in AEM Cloud Service with high-performance frontend delivery.

## Project Architecture & Key Components

- **Block System**: Component-based architecture with each block in `blocks/[name]/` directory
  - `[block].js`: JavaScript functionality
  - `[block].css`: Styling
  - `_[block].json`: Component definition, models, and filters
- **Component Models**: Defined in JSON files, managed through AEM authoring
- **Scripts**: Global JavaScript functionality in `scripts/` directory
- **Styles**: Global CSS in `styles/` directory
- **fstab.yaml**: Content source mapping from AEM Cloud Service

## Coding Standards & Conventions

### JavaScript

- **ESLint Configuration**: Airbnb base + XWalk plugin + JSON
- **Module System**: ES6 modules with `.js` extensions required in imports
- **Parameter Reassignment**: Allowed for object properties, not for primitives
- **Line Endings**: Unix (LF) enforced
- **Browser Environment**: Code runs in browser, no Node.js APIs
- **Code Splitting**: Import functions and utilities from `scripts/aem.js` or `scripts/scripts.js`

### CSS

- **Stylelint**: Standard configuration
- **Responsive Design**: Mobile-first approach
- **CSS Custom Properties**: Use for consistent design tokens
- **Performance**: Minimal CSS, critical CSS inlining

### Naming Conventions

- **Blocks**: Kebab-case (`hero-banner`)
- **Files**: Match block name (`hero-banner.js`, `hero-banner.css`)
- **JavaScript Functions**: camelCase
- **CSS Classes**: Kebab-case matching block name
- **JSON Definitions**: Use `_[block-name].json`

## Block Development Patterns

### Standard Block Structure

```javascript
export default function decorate(block) {
  // Always decorate block element passed as parameter
  // Enumerate rows and cells for content processing
  const rows = Array.from(block.querySelectorAll(':scope > div'));
  
  // Process block content
  rows.forEach((row) => {
    const cells = Array.from(row.querySelectorAll(':scope > div'));
    // Enumerate cells and apply decorations
  });
}
```

### Component Model Structure

```json
{
  "definitions": [
    {
      "title": "Component Name",
      "id": "component-id",
      "plugins": {
        "xwalk": {
          "page": {
            "resourceType": "core/franklin/components/block/v1/block",
            "template": {
              "name": "Component Name",
              "model": "component-model-id"
            }
          }
        }
      }
    }
  ],
  "models": [
    {
      "id": "component-model-id",
      "fields": [
        {
          "component": "text",
          "valueType": "string",
          "name": "fieldName",
          "label": "Field Label",
          "value": ""
        }
      ]
    }
  ],
  "filters": []
}
```

### Common Field Types

- `component: "text"` - Simple text input
- `component: "richtext"` - Richer content editing
- `component: "reference"` - Asset/image references
- `component: "aem-content"` - Internal content links
- `component: "aem-tag"` - Tag selection
- `component: "select"` - Dropdown selection

## Performance Best Practices

- **Lazy Loading**: Implement for images and non-critical content
- **Deferred Scripts**: Use `scripts/delayed.js` for non-critical functionality
- **CSS Minimisation**: Keep CSS lean, use efficient selectors
- **JavaScript Optimisation**: Minimije DOM manipulation, batch operations
- **Image Optimisation**: Leverage AEM's adaptive image delivery

## Development Workflow

- **Local Development**: Use AEM CLI with `aem up` command
- **Auth-Sync**: AEM Code Sync GitHub App for automatic deployment
- **Content Syncing**: File system mapping via `fstab.yaml`
- **Content Source**: AEM Cloud Service authoring interface

## XWalk Specific Features

- **WYSIWYG Editing**: Component definitions enable visual editing in AEM
- **Component Models**: Structured content definitions for author UI
- **Content Filters**: Content transformation and filtering rules
- **Auto-Blocking**: Automatic detection and decoration of blocks
- **Runtime Integration**: Seamless integration with AEM's editing interface

## When generating code for this project:

1. **Always follow ESLint rules**: Airbnb base + XWalk plugin + JSON
2. **Use proper block structure**: Export default function accepting block element
3. **Optimize for performance**: Minimal, efficient code patterns
4. **Follow naming conventions**: Kebab-case for blocks and files
5. **Implement accessibility**: Proper ARIA attributes and semantic HTML
6. **Consider mobile-first**: Responsive design patterns
7. **Leverage AEM utilities**: Use functions from `scripts/aem.js` and `scripts/scripts.js`
8. **Create complete component definitions**: Include _[block].json for new blocks
9. **Maintain consistency**: Follow existing patterns in the codebase
10. **Document complexity**: Add comments for complex block logic or XWalk integrations