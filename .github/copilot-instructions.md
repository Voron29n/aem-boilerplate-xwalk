# GitHub Copilot Instructions for AEM Boilerplate with Cross-Walk Support

## Project Overview

This is an **Adobe Experience Manager (AEM) boilerplate** project for **Edge Delivery Services** with **Cross-Walk (xwalk) support**, enabling WYSIWYG authoring in AEM Cloud Service that publishes to Edge Delivery. This boilerplate serves as a starter template for building high-performance websites that leverage AEM's authoring capabilities with Edge Delivery's speed.

**Key Technologies**: JavaScript (ES6+), CSS, HTML, AEM Edge Delivery Services, Universal Editor, Cross-Walk integration

## Architecture & Project Structure

### Core Directories
- **`blocks/`** - Reusable UI components (hero, cards, columns, footer, header, fragment)
  - Each block contains: `blockname.js`, `blockname.css`, `_blockname.json` (component model)
- **`scripts/`** - Core JavaScript functionality
  - `aem.js` - Main AEM Edge Delivery utilities and block loading
  - `scripts.js` - Application initialization and utilities
  - `editor-support.js` - Universal Editor integration
  - `editor-support-rte.js` - Rich text editor support
- **`styles/`** - Global CSS styling
  - `styles.css` - Base styles and CSS variables
  - `fonts.css` - Font definitions and loading
  - `lazy-styles.css` - Non-critical styles loaded asynchronously
- **`models/`** - Component model definitions for Universal Editor
  - `_component-*.json` files define authoring interfaces
- **`tools/`** - Development and build utilities

### Key Files
- **`fstab.yaml`** - Defines content source mapping from AEM to Edge Delivery
- **`head.html`** - Document head template with meta tags and scripts
- **`paths.json`** - URL mapping configuration
- **`helix-*.yaml`** - Edge Delivery Services configuration files

## Development Workflow & Standards

### Prerequisites
- **Node.js 18.3.x or newer**
- **AEM Cloud Service release 2024.8 or newer (>= 17465)**
- AEM CLI: `npm install -g @adobe/aem-cli`

### Essential Commands
```bash
# Install dependencies
npm ci

# Linting (enforced via pre-commit hooks)
npm run lint              # Run both JS and CSS linting
npm run lint:js           # ESLint for JavaScript
npm run lint:css          # Stylelint for CSS
npm run lint:fix          # Auto-fix linting issues

# Component model building
npm run build:json        # Build all component definitions
npm run build:json:models # Build component models
npm run build:json:definitions # Build component definitions
npm run build:json:filters # Build component filters

# Local development
aem up                    # Start AEM proxy (opens http://localhost:3000)
```

### Code Quality Standards

#### JavaScript (ESLint Configuration)
- **Style Guide**: Airbnb base with custom overrides
- **Parser**: Babel ESLint parser
- **Key Rules**:
  - Require `.js` extensions in imports
  - Unix line endings enforced
  - Allow property modification on parameters
  - Browser environment assumed

#### CSS (Stylelint Configuration)
- **Standard**: stylelint-config-standard
- **Target Files**: `blocks/**/*.css` and `styles/*.css`
- **Format**: Auto-fixable with `npm run lint:fix`

#### Git Workflow
- **Commit Messages**: Use `npm run commit` for structured commit wizard
- **Pre-commit Hooks**: Husky enforces linting and model building
- **Pull Requests**: Use provided template with test URLs

## Block Development Guidelines

### Block Architecture Pattern
Each block follows this structure:
```
blocks/blockname/
├── blockname.js          # Block logic and DOM manipulation
├── blockname.css         # Block-specific styling
└── _blockname.json       # Component model for Universal Editor
```

### Block Development Standards

#### JavaScript (Block Logic)
```javascript
// Export main decoration function
export default function decorate(block) {
  // DOM manipulation and functionality
  // Use semantic HTML structure
  // Follow existing patterns from core blocks
}

// Optional: Export additional utilities
export function helperFunction() {
  // Reusable block-specific logic
}
```

#### CSS (Block Styling)
```css
/* Use BEM-like naming with block prefix */
.blockname {
  /* Block container styles */
}

.blockname-element {
  /* Child element styles */
}

.blockname--modifier {
  /* Block variations */
}

/* Responsive design required */
@media (width >= 768px) {
  .blockname {
    /* Tablet and desktop styles */
  }
}
```

#### Component Models (`_blockname.json`)
```json
{
  "definitions": [{
    "title": "Block Name",
    "id": "blockname",
    "plugins": {
      "xwalk": {
        "page": {
          "resourceType": "core/franklin/components/block/v1/block",
          "template": {
            "name": "Block Name",
            "model": "blockname"
          }
        }
      }
    }
  }],
  "models": [{
    "id": "blockname",
    "fields": [
      // Field definitions for Universal Editor authoring
    ]
  }],
  "filters": []
}
```

### Universal Editor Integration

#### Instrumentation Attributes
- **`data-aue-resource`** - Identifies editable components
- **`data-aue-prop`** - Specifies editable properties
- **`data-aue-type`** - Defines editing interface type
- **`data-aue-label`** - User-friendly labels for editors

#### Rich Text Support
```javascript
import { decorateRichtext } from './editor-support-rte.js';

// Call after DOM manipulation
decorateRichtext(blockElement);
```

## Performance & Best Practices

### Core Web Vitals Optimization
- **LCP**: Images optimized with `createOptimizedPicture()`
- **CLS**: Proper CSS dimensions for layout elements
- **FID**: Minimal JavaScript, event delegation patterns

### Loading Strategy
```javascript
// Critical resources load immediately
import { loadCSS } from './aem.js';

// Non-critical resources load after first paint
loadCSS('./styles/lazy-styles.css');

// Blocks load on-demand
decorateBlocks(main);
loadSections(main);
```

### Image Handling
```javascript
// Always use optimized pictures
import { createOptimizedPicture } from './aem.js';

const picture = createOptimizedPicture(
  src,
  alt,
  eager,  // boolean for above-fold images
  [{ media: '(min-width: 400px)', width: '2000' }, { width: '750' }]
);
```

## Common Development Patterns

### Block Decoration Pattern
```javascript
export default function decorate(block) {
  // Extract content from block table structure
  const [titleRow, contentRow] = block.children;
  
  // Create semantic structure
  const wrapper = document.createElement('div');
  wrapper.className = 'blockname-wrapper';
  
  // Move instrumentation for Universal Editor
  moveInstrumentation(block, wrapper);
  
  // Replace block content
  block.replaceChildren(wrapper);
}
```

### Dynamic Content Loading
```javascript
// Use existing AEM utilities
import { loadFragment } from './aem.js';

// Load external content
const fragment = await loadFragment('/path/to/fragment');
parentElement.appendChild(fragment);
```

### Event Handling
```javascript
// Use event delegation for performance
document.addEventListener('click', (event) => {
  if (event.target.matches('.blockname-button')) {
    // Handle click
  }
});
```

## Testing & Quality Assurance

### Browser Testing
- **Primary**: Chrome (latest), Firefox (latest), Safari (latest)
- **Mobile**: iOS Safari, Android Chrome
- **Accessibility**: Test with screen readers, keyboard navigation

### Performance Testing
- **Lighthouse**: Target 95+ scores across all metrics
- **RUM Data**: Monitor real user metrics via built-in sampling
- **Load Testing**: Test with slow 3G simulation

### Content Testing
- **Universal Editor**: Verify all authoring interfaces work
- **Cross-device**: Test responsive behavior
- **Content variations**: Test with different content lengths

## Deployment & Configuration

### Environment Setup
1. **Development**: `aem up` for local proxy
2. **Preview**: `https://main--{repo}--{owner}.aem.page/`
3. **Live**: `https://main--{repo}--{owner}.aem.live/`

### Content Source Configuration
Update `fstab.yaml` to point to your AEM author instance:
```yaml
mountpoints:
  /:
    url: "https://author-p[program]-e[env].adobeaemcloud.com/bin/franklin.delivery/[org]/[repo]/main"
    type: "markup"
    suffix: ".html"
```

## Troubleshooting & Common Issues

### Block Not Loading
1. Check console for JavaScript errors
2. Verify block folder structure matches block name
3. Ensure `decorate` function is properly exported
4. Check CSS selector specificity conflicts

### Universal Editor Issues
1. Verify instrumentation attributes are present
2. Check component model JSON syntax
3. Ensure models are built: `npm run build:json`
4. Test in incognito/private browsing mode

### Performance Issues
1. Check image optimization usage
2. Verify lazy loading implementation
3. Review critical resource loading order
4. Use browser dev tools Performance tab

### Styling Problems
1. Check CSS specificity and cascade order
2. Verify responsive breakpoints
3. Test CSS custom property usage
4. Validate CSS with stylelint

## Integration Points

### Adding New Blocks
1. Create block directory in `blocks/`
2. Implement JavaScript decoration function
3. Add CSS styling with proper naming
4. Create component model JSON
5. Build models: `npm run build:json`
6. Test in Universal Editor

### Extending Functionality
- **New utilities**: Add to `scripts/aem.js` and export
- **Global styles**: Add to `styles/styles.css`
- **Third-party integrations**: Use dynamic imports for performance

This project follows AEM Edge Delivery Services patterns with Cross-Walk integration for seamless authoring experiences. Always prioritize performance, accessibility, and maintainable code architecture.