/**
 * Unit tests for scripts/scripts.js
 * Tests main application logic and utility functions
 */

import {
  moveAttributes,
  moveInstrumentation,
  decorateMain,
} from '../../scripts/scripts.js';

// Mock AEM functions that are imported
jest.mock('../../scripts/aem.js', () => ({
  decorateButtons: jest.fn(),
  decorateIcons: jest.fn(),
  decorateSections: jest.fn(),
  decorateBlocks: jest.fn(),
  decorateTemplateAndTheme: jest.fn(),
  waitForFirstImage: jest.fn(),
  loadSection: jest.fn(),
  loadSections: jest.fn(),
  loadCSS: jest.fn(),
  loadHeader: jest.fn(),
  loadFooter: jest.fn(),
}));

describe('Scripts Utility Functions', () => {
  let fromElement;
  let toElement;

  beforeEach(() => {
    fromElement = document.createElement('div');
    toElement = document.createElement('div');
  });

  describe('moveAttributes', () => {
    test('should move all attributes when no specific attributes provided', () => {
      fromElement.setAttribute('class', 'test-class');
      fromElement.setAttribute('id', 'test-id');
      fromElement.setAttribute('data-custom', 'custom-value');

      moveAttributes(fromElement, toElement);

      // Check attributes moved to target
      expect(toElement.getAttribute('class')).toBe('test-class');
      expect(toElement.getAttribute('id')).toBe('test-id');
      expect(toElement.getAttribute('data-custom')).toBe('custom-value');

      // Check attributes removed from source
      expect(fromElement.getAttribute('class')).toBeNull();
      expect(fromElement.getAttribute('id')).toBeNull();
      expect(fromElement.getAttribute('data-custom')).toBeNull();
    });

    test('should move only specified attributes', () => {
      fromElement.setAttribute('class', 'test-class');
      fromElement.setAttribute('id', 'test-id');
      fromElement.setAttribute('data-custom', 'custom-value');

      moveAttributes(fromElement, toElement, ['class', 'data-custom']);

      // Check specified attributes moved
      expect(toElement.getAttribute('class')).toBe('test-class');
      expect(toElement.getAttribute('data-custom')).toBe('custom-value');

      // Check non-specified attribute not moved
      expect(toElement.getAttribute('id')).toBeNull();
      expect(fromElement.getAttribute('id')).toBe('test-id');
    });

    test('should handle non-existent attributes gracefully', () => {
      fromElement.setAttribute('class', 'test-class');

      moveAttributes(fromElement, toElement, ['class', 'non-existent']);

      expect(toElement.getAttribute('class')).toBe('test-class');
      expect(toElement.getAttribute('non-existent')).toBeNull();
    });

    test('should handle null target element', () => {
      fromElement.setAttribute('class', 'test-class');

      expect(() => {
        moveAttributes(fromElement, null, ['class']);
      }).not.toThrow();

      // Attribute should still be removed from source
      expect(fromElement.getAttribute('class')).toBeNull();
    });

    test('should handle empty attributes', () => {
      fromElement.setAttribute('empty-attr', '');
      fromElement.setAttribute('class', 'test-class');

      moveAttributes(fromElement, toElement);

      // Empty string attributes are not moved (falsy value)
      expect(toElement.getAttribute('empty-attr')).toBeNull();
      expect(fromElement.getAttribute('empty-attr')).toBe(''); // Still on source

      // Non-empty attributes are moved
      expect(toElement.getAttribute('class')).toBe('test-class');
      expect(fromElement.getAttribute('class')).toBeNull(); // Removed from source
    });
  });

  describe('moveInstrumentation', () => {
    test('should move AEM authoring attributes', () => {
      fromElement.setAttribute('data-aue-prop', 'title');
      fromElement.setAttribute('data-aue-type', 'text');
      fromElement.setAttribute('data-richtext-editor', 'true');
      fromElement.setAttribute('class', 'regular-class');
      fromElement.setAttribute('id', 'test-id');

      moveInstrumentation(fromElement, toElement);

      // Check AEM attributes moved
      expect(toElement.getAttribute('data-aue-prop')).toBe('title');
      expect(toElement.getAttribute('data-aue-type')).toBe('text');
      expect(toElement.getAttribute('data-richtext-editor')).toBe('true');

      // Check non-AEM attributes not moved
      expect(toElement.getAttribute('class')).toBeNull();
      expect(toElement.getAttribute('id')).toBeNull();
      expect(fromElement.getAttribute('class')).toBe('regular-class');
      expect(fromElement.getAttribute('id')).toBe('test-id');
    });

    test('should handle elements with no instrumentation attributes', () => {
      fromElement.setAttribute('class', 'test-class');
      fromElement.setAttribute('id', 'test-id');

      moveInstrumentation(fromElement, toElement);

      // No attributes should be moved
      expect(toElement.getAttribute('class')).toBeNull();
      expect(toElement.getAttribute('id')).toBeNull();
      expect(fromElement.getAttribute('class')).toBe('test-class');
      expect(fromElement.getAttribute('id')).toBe('test-id');
    });

    test('should move both data-aue and data-richtext attributes', () => {
      fromElement.setAttribute('data-aue-prop', 'title');
      fromElement.setAttribute('data-richtext-editor', 'true');
      fromElement.setAttribute('data-aue-model', 'component');
      fromElement.setAttribute('data-richtext-format', 'html');

      moveInstrumentation(fromElement, toElement);

      expect(toElement.getAttribute('data-aue-prop')).toBe('title');
      expect(toElement.getAttribute('data-richtext-editor')).toBe('true');
      expect(toElement.getAttribute('data-aue-model')).toBe('component');
      expect(toElement.getAttribute('data-richtext-format')).toBe('html');
    });
  });

  describe('decorateMain', () => {
    let mainElement;
    let mockAem;

    beforeEach(() => {
      mainElement = document.createElement('main');
      document.body.appendChild(mainElement);

      // Get mocked AEM functions
      mockAem = require('../../scripts/aem.js');
    });

    afterEach(() => {
      document.body.removeChild(mainElement);
      jest.clearAllMocks();
    });

    test('should call all decoration functions in correct order', () => {
      decorateMain(mainElement);

      expect(mockAem.decorateButtons).toHaveBeenCalledWith(mainElement);
      expect(mockAem.decorateIcons).toHaveBeenCalledWith(mainElement);
      expect(mockAem.decorateSections).toHaveBeenCalledWith(mainElement);
      expect(mockAem.decorateBlocks).toHaveBeenCalledWith(mainElement);

      // Verify call order
      const callOrder = [
        mockAem.decorateButtons,
        mockAem.decorateIcons,
        mockAem.decorateSections,
        mockAem.decorateBlocks,
      ];

      callOrder.forEach((mockFn, index) => {
        if (index < callOrder.length - 1) {
          expect(mockFn.mock.invocationCallOrder[0])
            .toBeLessThan(callOrder[index + 1].mock.invocationCallOrder[0]);
        }
      });
    });

    test('should handle null main element gracefully', () => {
      expect(() => {
        decorateMain(null);
      }).not.toThrow();

      expect(mockAem.decorateButtons).toHaveBeenCalledWith(null);
      expect(mockAem.decorateIcons).toHaveBeenCalledWith(null);
      expect(mockAem.decorateSections).toHaveBeenCalledWith(null);
      expect(mockAem.decorateBlocks).toHaveBeenCalledWith(null);
    });

    test('should handle main element with content', () => {
      mainElement.innerHTML = `
        <div class="section">
          <div class="hero">
            <p><a href="/test">Button Link</a></p>
            <span class="icon icon-test"></span>
          </div>
        </div>
      `;

      decorateMain(mainElement);

      expect(mockAem.decorateButtons).toHaveBeenCalledWith(mainElement);
      expect(mockAem.decorateIcons).toHaveBeenCalledWith(mainElement);
      expect(mockAem.decorateSections).toHaveBeenCalledWith(mainElement);
      expect(mockAem.decorateBlocks).toHaveBeenCalledWith(mainElement);
    });
  });

  describe('Integration with AEM functions', () => {
    test('should import all required AEM functions', () => {
      const aemModule = require('../../scripts/aem.js');

      expect(aemModule.decorateButtons).toBeDefined();
      expect(aemModule.decorateIcons).toBeDefined();
      expect(aemModule.decorateSections).toBeDefined();
      expect(aemModule.decorateBlocks).toBeDefined();
      expect(aemModule.decorateTemplateAndTheme).toBeDefined();
      expect(aemModule.waitForFirstImage).toBeDefined();
      expect(aemModule.loadSection).toBeDefined();
      expect(aemModule.loadSections).toBeDefined();
      expect(aemModule.loadCSS).toBeDefined();
      expect(aemModule.loadHeader).toBeDefined();
      expect(aemModule.loadFooter).toBeDefined();
    });
  });
});
