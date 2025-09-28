/**
 * Unit tests for scripts/aem.js
 * Tests core AEM utility functions
 */

import {
  toClassName,
  toCamelCase,
  getMetadata,
  readBlockConfig,
  createOptimizedPicture,
  decorateButtons,
  buildBlock,
  decorateBlock,
  decorateTemplateAndTheme,
  wrapTextNodes,
} from '../../scripts/aem.js';

describe('AEM Utility Functions', () => {
  describe('toClassName', () => {
    test('should convert string to valid CSS class name', () => {
      expect(toClassName('Hello World')).toBe('hello-world');
      expect(toClassName('Test-Class_Name')).toBe('test-class-name');
      expect(toClassName('123ABC')).toBe('123abc');
      expect(toClassName('Special!@#$%Characters')).toBe('special-characters');
    });

    test('should handle edge cases', () => {
      expect(toClassName('')).toBe('');
      expect(toClassName(null)).toBe('');
      expect(toClassName(undefined)).toBe('');
      expect(toClassName('---test---')).toBe('test');
    });
  });

  describe('toCamelCase', () => {
    test('should convert kebab-case to camelCase', () => {
      expect(toCamelCase('hello-world')).toBe('helloWorld');
      expect(toCamelCase('test-class-name')).toBe('testClassName');
      expect(toCamelCase('single')).toBe('single');
      expect(toCamelCase('a-b-c-d')).toBe('aBCD');
    });

    test('should handle edge cases', () => {
      expect(toCamelCase('')).toBe('');
      expect(toCamelCase('no-dashes-here')).toBe('noDashesHere');
    });
  });

  describe('getMetadata', () => {
    beforeEach(() => {
      document.head.innerHTML = '';
    });

    test('should retrieve metadata by name', () => {
      document.head.innerHTML = `
        <meta name="description" content="Test description">
        <meta name="keywords" content="test, keywords">
      `;

      expect(getMetadata('description')).toBe('Test description');
      expect(getMetadata('keywords')).toBe('test, keywords');
    });

    test('should retrieve metadata by property', () => {
      document.head.innerHTML = `
        <meta property="og:title" content="OpenGraph Title">
        <meta property="og:description" content="OpenGraph Description">
      `;

      expect(getMetadata('og:title')).toBe('OpenGraph Title');
      expect(getMetadata('og:description')).toBe('OpenGraph Description');
    });

    test('should return empty string for non-existent metadata', () => {
      expect(getMetadata('non-existent')).toBe('');
    });

    test('should join multiple metadata values', () => {
      document.head.innerHTML = `
        <meta name="keywords" content="test1">
        <meta name="keywords" content="test2">
      `;

      expect(getMetadata('keywords')).toBe('test1, test2');
    });
  });

  describe('readBlockConfig', () => {
    test('should extract configuration from block element', () => {
      const block = document.createElement('div');
      block.innerHTML = `
        <div>
          <div>Title</div>
          <div>Test Title</div>
        </div>
        <div>
          <div>Description</div>
          <div><p>Test Description</p></div>
        </div>
      `;

      const config = readBlockConfig(block);
      expect(config.title).toBe('Test Title');
      expect(config.description).toBe('Test Description');
    });

    test('should handle link values', () => {
      const block = document.createElement('div');
      block.innerHTML = `
        <div>
          <div>Link</div>
          <div><a href="https://example.com">Example</a></div>
        </div>
      `;

      const config = readBlockConfig(block);
      expect(config.link).toBe('https://example.com/'); // JSDOM adds trailing slash
    });

    test('should handle multiple links', () => {
      const block = document.createElement('div');
      block.innerHTML = `
        <div>
          <div>Links</div>
          <div>
            <a href="https://example1.com">Example 1</a>
            <a href="https://example2.com">Example 2</a>
          </div>
        </div>
      `;

      const config = readBlockConfig(block);
      expect(config.links).toEqual(['https://example1.com/', 'https://example2.com/']); // JSDOM adds trailing slash
    });

    test('should handle image values', () => {
      const block = document.createElement('div');
      block.innerHTML = `
        <div>
          <div>Image</div>
          <div><img src="/test.jpg" alt="Test"></div>
        </div>
      `;

      const config = readBlockConfig(block);
      expect(config.image).toBe('http://localhost/test.jpg'); // JSDOM resolves relative URLs
    });
  });

  describe('createOptimizedPicture', () => {
    test('should create picture element with webp and fallback sources', () => {
      const picture = createOptimizedPicture('/test.jpg', 'Test image');

      expect(picture.tagName).toBe('PICTURE');

      // Check for webp sources
      const webpSources = picture.querySelectorAll('source[type="image/webp"]');
      expect(webpSources.length).toBe(2);

      // Check for fallback sources
      const fallbackSources = picture.querySelectorAll('source:not([type="image/webp"])');
      expect(fallbackSources.length).toBe(1);

      // Check img element
      const img = picture.querySelector('img');
      expect(img).toBeTruthy();
      expect(img.getAttribute('alt')).toBe('Test image');
      expect(img.getAttribute('loading')).toBe('lazy');
    });

    test('should handle eager loading', () => {
      const picture = createOptimizedPicture('/test.jpg', 'Test image', true);
      const img = picture.querySelector('img');
      expect(img.getAttribute('loading')).toBe('eager');
    });
  });

  describe('decorateButtons', () => {
    test('should decorate single link in paragraph as button', () => {
      const container = document.createElement('div');
      container.innerHTML = '<p><a href="/test">Test Link</a></p>';

      decorateButtons(container);

      const link = container.querySelector('a');
      const paragraph = container.querySelector('p');

      expect(link.className).toBe('button');
      expect(paragraph.classList.contains('button-container')).toBe(true);
    });

    test('should decorate strong link as primary button', () => {
      const container = document.createElement('div');
      container.innerHTML = '<p><strong><a href="/test">Primary Button</a></strong></p>';

      decorateButtons(container);

      const link = container.querySelector('a');
      const paragraph = container.querySelector('p');

      expect(link.className).toBe('button primary');
      expect(paragraph.classList.contains('button-container')).toBe(true);
    });

    test('should decorate emphasis link as secondary button', () => {
      const container = document.createElement('div');
      container.innerHTML = '<p><em><a href="/test">Secondary Button</a></em></p>';

      decorateButtons(container);

      const link = container.querySelector('a');
      const paragraph = container.querySelector('p');

      expect(link.className).toBe('button secondary');
      expect(paragraph.classList.contains('button-container')).toBe(true);
    });

    test('should not decorate links with images', () => {
      const container = document.createElement('div');
      container.innerHTML = '<p><a href="/test"><img src="/test.jpg" alt="Test"></a></p>';

      decorateButtons(container);

      const link = container.querySelector('a');
      const paragraph = container.querySelector('p');

      expect(link.className).toBe('');
      expect(paragraph.classList.contains('button-container')).toBe(false);
    });
  });

  describe('buildBlock', () => {
    test('should build block from 2D array', () => {
      const content = [
        ['Row 1 Col 1', 'Row 1 Col 2'],
        ['Row 2 Col 1', 'Row 2 Col 2'],
      ];

      const block = buildBlock('test-block', content);

      expect(block.classList.contains('test-block')).toBe(true);
      expect(block.children.length).toBe(2);

      // Check first row
      const firstRow = block.children[0];
      expect(firstRow.children.length).toBe(2);
      expect(firstRow.children[0].textContent).toBe('Row 1 Col 1');
      expect(firstRow.children[1].textContent).toBe('Row 1 Col 2');
    });

    test('should build block from string content', () => {
      const block = buildBlock('test-block', 'Simple content');

      expect(block.classList.contains('test-block')).toBe(true);
      expect(block.children.length).toBe(1);
      expect(block.children[0].children[0].textContent).toBe('Simple content');
    });

    test('should build block from object content', () => {
      const element = document.createElement('div');
      element.textContent = 'Object content';
      const content = element; // Use an actual DOM element instead of plain object
      const block = buildBlock('test-block', content);

      expect(block.classList.contains('test-block')).toBe(true);
      expect(block.children.length).toBe(1);
      expect(block.textContent).toContain('Object content');
    });
  });

  describe('decorateBlock', () => {
    test('should decorate block with proper classes and attributes', () => {
      const block = document.createElement('div');
      block.classList.add('test-block');

      const wrapper = document.createElement('div');
      wrapper.appendChild(block);

      const section = document.createElement('div');
      section.classList.add('section');
      section.appendChild(wrapper);

      decorateBlock(block);

      expect(block.classList.contains('block')).toBe(true);
      expect(block.dataset.blockName).toBe('test-block');
      expect(block.dataset.blockStatus).toBe('initialized');
      expect(wrapper.classList.contains('test-block-wrapper')).toBe(true);
      expect(section.classList.contains('test-block-container')).toBe(true);
    });
  });

  describe('decorateTemplateAndTheme', () => {
    beforeEach(() => {
      document.head.innerHTML = '';
      document.body.className = '';
    });

    test('should add template class to body', () => {
      document.head.innerHTML = '<meta name="template" content="landing-page">';

      decorateTemplateAndTheme();

      expect(document.body.classList.contains('landing-page')).toBe(true);
    });

    test('should add theme class to body', () => {
      document.head.innerHTML = '<meta name="theme" content="dark-theme">';

      decorateTemplateAndTheme();

      expect(document.body.classList.contains('dark-theme')).toBe(true);
    });

    test('should handle multiple template/theme classes', () => {
      document.head.innerHTML = `
        <meta name="template" content="landing-page, special">
        <meta name="theme" content="dark, mobile">
      `;

      decorateTemplateAndTheme();

      expect(document.body.classList.contains('landing-page')).toBe(true);
      expect(document.body.classList.contains('special')).toBe(true);
      expect(document.body.classList.contains('dark')).toBe(true);
      expect(document.body.classList.contains('mobile')).toBe(true);
    });
  });

  describe('wrapTextNodes', () => {
    test('should wrap text content in paragraph tags', () => {
      const block = document.createElement('div');
      block.innerHTML = `
        <div>
          <div>Plain text content</div>
        </div>
      `;

      wrapTextNodes(block);

      const cell = block.querySelector('div div');
      const paragraph = cell.querySelector('p');
      expect(paragraph).toBeTruthy();
      expect(paragraph.textContent).toBe('Plain text content');
    });

    test('should not wrap content that already has valid wrappers', () => {
      const block = document.createElement('div');
      block.innerHTML = `
        <div>
          <div><p>Already wrapped</p></div>
        </div>
      `;

      wrapTextNodes(block);

      const cell = block.querySelector('div div');
      const paragraphs = cell.querySelectorAll('p');
      expect(paragraphs.length).toBe(1);
      expect(paragraphs[0].textContent).toBe('Already wrapped');
    });

    test('should preserve attributes when wrapping', () => {
      const block = document.createElement('div');
      block.innerHTML = `
        <div>
          <div class="test-class" data-aue-prop="test">Text content</div>
        </div>
      `;

      wrapTextNodes(block);

      const cell = block.querySelector('div div');
      const paragraph = cell.querySelector('p');
      expect(paragraph.classList.contains('test-class')).toBe(true);
      expect(paragraph.getAttribute('data-aue-prop')).toBe('test');
      expect(cell.classList.contains('test-class')).toBe(false);
    });
  });
});
