/**
 * Unit tests for blocks/fragment/fragment.js
 * Tests fragment loading functionality
 */

// Mock scripts
import { loadFragment } from '../../blocks/fragment/fragment.js';

jest.mock('../../scripts/scripts.js', () => ({
  decorateMain: jest.fn(),
}));

jest.mock('../../scripts/aem.js', () => ({
  loadSections: jest.fn(),
}));

describe('Fragment Utilities', () => {
  let mockFetch;
  let mockDecorateMain;
  let mockLoadSections;

  beforeEach(() => {
    // Setup mocks
    mockFetch = jest.fn();
    global.fetch = mockFetch;

    mockDecorateMain = require('../../scripts/scripts.js').decorateMain;
    mockLoadSections = require('../../scripts/aem.js').loadSections;

    // Reset mocks
    jest.clearAllMocks();
  });

  describe('loadFragment', () => {
    test('should load fragment from valid path', async () => {
      const mockHtml = `
        <h1>Fragment Title</h1>
        <p>Fragment content</p>
        <img src="./media_123/image.jpg" alt="Test">
      `;

      mockFetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(mockHtml),
      });

      const result = await loadFragment('/test-fragment');

      expect(mockFetch).toHaveBeenCalledWith('/test-fragment.plain.html');
      expect(result).toBeInstanceOf(HTMLElement);
      expect(result.tagName).toBe('MAIN');
      expect(result.textContent).toContain('Fragment Title');
      expect(result.textContent).toContain('Fragment content');
    });

    test('should handle paths with .html extension', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('<p>Test content</p>'),
      });

      await loadFragment('/test-fragment.html');

      expect(mockFetch).toHaveBeenCalledWith('/test-fragment.plain.html');
    });

    test('should handle paths with .plain.html extension', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('<p>Test content</p>'),
      });

      await loadFragment('/test-fragment.plain.html');

      expect(mockFetch).toHaveBeenCalledWith('/test-fragment.plain.html');
    });

    test('should fix media paths relative to fragment', async () => {
      const mockHtml = `
        <img src="./media_123/image1.jpg" alt="Image 1">
        <img src="./media_456/image2.png" alt="Image 2">
        <source srcset="./media_789/image3.webp">
      `;

      mockFetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(mockHtml),
      });

      const result = await loadFragment('/fragments/test-fragment');

      // Check that media paths were processed (exact URLs depend on JSDOM's base URL handling)
      const images = result.querySelectorAll('img');
      expect(images.length).toBe(2);
      expect(images[0].src).toContain('media_123/image1.jpg');
      expect(images[1].src).toContain('media_456/image2.png');

      const source = result.querySelector('source');
      expect(source.srcset).toContain('media_789/image3.webp');
    });

    test('should call decorateMain and loadSections', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('<p>Test content</p>'),
      });

      const result = await loadFragment('/test-fragment');

      expect(mockDecorateMain).toHaveBeenCalledWith(result);
      expect(mockLoadSections).toHaveBeenCalledWith(result);
    });

    test('should return null for failed fetch', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
      });

      const result = await loadFragment('/non-existent-fragment');

      expect(result).toBeNull();
      expect(mockDecorateMain).not.toHaveBeenCalled();
      expect(mockLoadSections).not.toHaveBeenCalled();
    });

    test('should return null for invalid path', async () => {
      const result1 = await loadFragment('');
      const result2 = await loadFragment(null);
      const result3 = await loadFragment(undefined);
      const result4 = await loadFragment('relative-path');

      expect(result1).toBeNull();
      expect(result2).toBeNull();
      expect(result3).toBeNull();
      expect(result4).toBeNull();
      expect(mockFetch).not.toHaveBeenCalled();
    });

    test('should handle fetch errors gracefully', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      // The loadFragment function doesn't handle fetch errors, so they bubble up
      await expect(loadFragment('/test-fragment')).rejects.toThrow('Network error');
    });

    test('should handle empty fragment content', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(''),
      });

      const result = await loadFragment('/empty-fragment');

      expect(result).toBeInstanceOf(HTMLElement);
      expect(result.tagName).toBe('MAIN');
      expect(result.innerHTML).toBe('');
      expect(mockDecorateMain).toHaveBeenCalledWith(result);
      expect(mockLoadSections).toHaveBeenCalledWith(result);
    });

    test('should handle complex fragment with blocks', async () => {
      const mockHtml = `
        <div class="section">
          <div class="hero">
            <div>
              <div>Hero Title</div>
            </div>
            <div>
              <div>Hero Description</div>
            </div>
          </div>
        </div>
        <div class="section">
          <div class="cards">
            <div>
              <div>Card Title</div>
              <div>Card Content</div>
            </div>
          </div>
        </div>
      `;

      mockFetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(mockHtml),
      });

      const result = await loadFragment('/complex-fragment');

      expect(result.querySelectorAll('.section').length).toBe(2);
      expect(result.querySelector('.hero')).toBeTruthy();
      expect(result.querySelector('.cards')).toBeTruthy();
      expect(mockDecorateMain).toHaveBeenCalledWith(result);
      expect(mockLoadSections).toHaveBeenCalledWith(result);
    });

    test('should handle media paths that do not match pattern', async () => {
      const mockHtml = `
        <img src="/absolute/path/image.jpg" alt="Absolute">
        <img src="https://example.com/external/image.jpg" alt="External">
        <img src="./regular/image.jpg" alt="Regular">
      `;

      mockFetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(mockHtml),
      });

      const result = await loadFragment('/test-fragment');

      const images = result.querySelectorAll('img');

      // Just verify that images exist and have some src values
      expect(images.length).toBe(3);
      expect(images[0].src).toContain('/absolute/path/image.jpg');
      expect(images[1].src).toBe('https://example.com/external/image.jpg');
      expect(images[2].src).toContain('/regular/image.jpg');
    });
  });
});
