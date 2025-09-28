# Testing Documentation

This project uses Jest as the primary testing framework with JSDOM environment for browser-like testing of Adobe EDS (Edge Delivery Services) components.

## Test Structure

```
test/
├── README.md                 # This documentation
├── setup.js                  # Jest setup and global mocks
├── mocks/
│   └── aem-mocks.js          # Mock utilities for AEM-specific functions
├── scripts/
│   ├── aem.test.js           # Tests for core AEM utility functions
│   └── scripts.test.js       # Tests for main application logic
└── blocks/
    ├── footer.test.js        # Tests for footer block functionality
    └── fragment.test.js      # Tests for fragment loading utilities
```

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode for development
npm run test:watch

# Run tests in CI mode (no watch, with coverage)
npm run test:ci
```

### Running Specific Tests

```bash
# Run tests for a specific file
npm test -- --testPathPatterns="aem.test.js"

# Run tests with verbose output
npm test -- --verbose

# Run tests for a specific test suite
npm test -- --testNamePattern="toClassName"
```

## Test Environment

### Browser Mocking

The test environment provides mocks for:
- `window.hlx` - AEM's global configuration object
- `window.performance` - Performance API
- `navigator.sendBeacon` - Analytics beacon API
- `sessionStorage` / `localStorage` - Web storage APIs
- `fetch` - Network requests

### AEM-Specific Mocks

Located in `test/mocks/aem-mocks.js`:
- `mockLoadFragment` - Fragment loading functionality
- `mockGetMetadata` - Metadata retrieval
- `mockDecorateMain` - Main content decoration
- Helper functions for creating mock DOM elements

## Writing Tests

### Test File Naming

- Use `.test.js` suffix for test files
- Mirror the source file structure in the test directory
- Example: `scripts/aem.js` → `test/scripts/aem.test.js`

### Example Test Structure

```javascript
import { functionToTest } from '../../scripts/aem.js';

describe('Module Name', () => {
  beforeEach(() => {
    // Setup before each test
    document.body.innerHTML = '';
  });

  describe('functionToTest', () => {
    test('should perform expected behavior', () => {
      // Arrange
      const input = 'test-input';
      
      // Act
      const result = functionToTest(input);
      
      // Assert
      expect(result).toBe('expected-output');
    });
  });
});
```

### Testing DOM Manipulation

```javascript
test('should modify DOM elements', () => {
  // Create test element
  const element = document.createElement('div');
  element.innerHTML = '<p>Original content</p>';
  document.body.appendChild(element);
  
  // Test the function
  decorateFunction(element);
  
  // Assert changes
  expect(element.querySelector('.decorated')).toBeTruthy();
});
```

### Mocking External Dependencies

```javascript
// Mock AEM functions
jest.mock('../../scripts/aem.js', () => ({
  getMetadata: jest.fn(),
  loadCSS: jest.fn(),
}));

// Use mocks in tests
const mockGetMetadata = require('../../scripts/aem.js').getMetadata;
mockGetMetadata.mockReturnValue('test-value');
```

## Coverage Reports

Coverage reports are generated in the `coverage/` directory:
- `coverage/lcov-report/index.html` - HTML coverage report
- `coverage/lcov.info` - LCOV format for CI tools
- Console output shows summary during test runs

### Coverage Thresholds

Current thresholds (configured in `jest.config.js`):
- Statements: 20%
- Branches: 10%
- Functions: 25%
- Lines: 20%

## Best Practices

### 1. Test Isolation
- Each test should be independent
- Use `beforeEach` to reset state
- Don't rely on test execution order

### 2. Descriptive Test Names
```javascript
// Good
test('should convert kebab-case to camelCase')

// Bad
test('toCamelCase works')
```

### 3. Arrange-Act-Assert Pattern
```javascript
test('should format user input', () => {
  // Arrange
  const input = 'USER INPUT';
  
  // Act
  const result = formatInput(input);
  
  // Assert
  expect(result).toBe('user-input');
});
```

### 4. Mock External Dependencies
- Mock network calls with `fetch`
- Mock complex DOM APIs
- Use Jest's built-in mocking capabilities

### 5. Test Edge Cases
- Empty inputs
- Null/undefined values
- Invalid data types
- Boundary conditions

## Configuration Files

### jest.config.js
Main Jest configuration with:
- JSDOM test environment
- ES module support via Babel
- Coverage settings
- Test file patterns

### babel.config.js
Babel configuration for ES module transformation:
- Targets Node.js current version
- Transforms modern JavaScript for Jest

### test/setup.js
Global test setup:
- Browser API mocks
- AEM-specific global objects
- beforeEach hooks for cleanup

## Troubleshooting

### Common Issues

1. **Module import errors**
   - Ensure Babel is configured correctly
   - Check file extensions in imports
   - Verify Jest can resolve modules

2. **DOM-related test failures**
   - Use JSDOM environment
   - Reset DOM state in `beforeEach`
   - Mock browser APIs as needed

3. **Async test issues**
   - Use `async/await` or return promises
   - Mock async functions properly
   - Set appropriate test timeouts

### Debug Tips

```javascript
// Debug DOM state
console.log(document.body.innerHTML);

// Debug mock calls
console.log(mockFunction.mock.calls);

// Inspect element properties
console.log(element.outerHTML);
```

## Integration with CI/CD

The testing setup integrates with existing linting and build processes:
- ESLint rules are relaxed for test files
- Jest runs alongside existing npm scripts
- Coverage reports can be sent to external services
- Tests run as part of pre-commit hooks (if configured)