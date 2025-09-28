/**
 * Unit tests for blocks/footer/footer.js
 * Tests footer block functionality
 */

// Mock the AEM utilities and fragment loader
jest.mock('../../scripts/aem.js', () => ({
  getMetadata: jest.fn(),
}));

jest.mock('../../blocks/fragment/fragment.js', () => ({
  loadFragment: jest.fn(),
}));

import footerDecorate from '../../blocks/footer/footer.js';

describe('Footer Block', () => {
  let mockGetMetadata;
  let mockLoadFragment;
  let blockElement;

  beforeEach(() => {
    // Setup mocks
    mockGetMetadata = require('../../scripts/aem.js').getMetadata;
    mockLoadFragment = require('../../blocks/fragment/fragment.js').loadFragment;

    // Create block element
    blockElement = document.createElement('div');
    blockElement.classList.add('footer', 'block');
    blockElement.textContent = 'Original footer content';

    // Reset mocks
    jest.clearAllMocks();
  });

  test('should load footer fragment using metadata path', async () => {
    // Setup mock metadata
    mockGetMetadata.mockReturnValue('/custom-footer');

    // Setup mock fragment
    const mockFragment = document.createElement('main');
    mockFragment.innerHTML = `
      <div class="footer-content">
        <p>Footer fragment content</p>
        <nav>
          <ul>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </nav>
      </div>
    `;
    mockLoadFragment.mockResolvedValue(mockFragment);

    // Execute footer decoration
    await footerDecorate(blockElement);

    // Verify metadata was checked
    expect(mockGetMetadata).toHaveBeenCalledWith('footer');

    // Verify fragment was loaded with correct path
    expect(mockLoadFragment).toHaveBeenCalledWith('/custom-footer');

    // Verify original content was cleared
    expect(blockElement.textContent).not.toContain('Original footer content');

    // Verify fragment content was added
    const footerDiv = blockElement.querySelector('div');
    expect(footerDiv).toBeTruthy();
    expect(footerDiv.querySelector('.footer-content')).toBeTruthy();
    expect(footerDiv.textContent).toContain('Footer fragment content');
  });

  test('should use default footer path when no metadata', async () => {
    // Setup mock metadata to return empty string
    mockGetMetadata.mockReturnValue('');

    // Setup mock fragment
    const mockFragment = document.createElement('main');
    mockFragment.innerHTML = '<div class="default-footer">Default footer</div>';
    mockLoadFragment.mockResolvedValue(mockFragment);

    // Execute footer decoration
    await footerDecorate(blockElement);

    // Verify default path was used
    expect(mockLoadFragment).toHaveBeenCalledWith('/footer');

    // Verify content was added
    expect(blockElement.textContent).toContain('Default footer');
  });

  test('should handle relative metadata paths correctly', async () => {
    // Setup window.location for URL resolution
    Object.defineProperty(window, 'location', {
      value: {
        href: 'https://example.com/en/page',
        origin: 'https://example.com',
      },
      writable: true,
    });

    // Setup mock metadata with relative path
    mockGetMetadata.mockReturnValue('./footer-en');

    // Setup mock fragment
    const mockFragment = document.createElement('main');
    mockFragment.innerHTML = '<div class="localized-footer">EN Footer</div>';
    mockLoadFragment.mockResolvedValue(mockFragment);

    // Execute footer decoration
    await footerDecorate(blockElement);

    // Verify path was resolved relative to current location
    expect(mockLoadFragment).toHaveBeenCalledWith('/en/footer-en');

    // Verify content was added
    expect(blockElement.textContent).toContain('EN Footer');
  });

  test('should handle absolute metadata paths correctly', async () => {
    // Setup mock metadata with absolute URL
    mockGetMetadata.mockReturnValue('https://example.com/shared/footer');

    // Setup mock fragment
    const mockFragment = document.createElement('main');
    mockFragment.innerHTML = '<div class="shared-footer">Shared Footer</div>';
    mockLoadFragment.mockResolvedValue(mockFragment);

    // Execute footer decoration
    await footerDecorate(blockElement);

    // Verify absolute path was used correctly
    expect(mockLoadFragment).toHaveBeenCalledWith('/shared/footer');
  });

  test('should handle multiple child elements in fragment', async () => {
    mockGetMetadata.mockReturnValue('/footer');

    // Setup mock fragment with multiple children
    const mockFragment = document.createElement('main');
    mockFragment.innerHTML = `
      <div class="footer-top">Top section</div>
      <div class="footer-middle">Middle section</div>
      <div class="footer-bottom">Bottom section</div>
    `;
    mockLoadFragment.mockResolvedValue(mockFragment);

    // Execute footer decoration
    await footerDecorate(blockElement);

    // Verify all children were moved
    const footerDiv = blockElement.querySelector('div');
    expect(footerDiv.children.length).toBe(3);
    expect(footerDiv.querySelector('.footer-top')).toBeTruthy();
    expect(footerDiv.querySelector('.footer-middle')).toBeTruthy();
    expect(footerDiv.querySelector('.footer-bottom')).toBeTruthy();
  });

  test('should handle empty fragment gracefully', async () => {
    mockGetMetadata.mockReturnValue('/footer');

    // Setup empty mock fragment
    const mockFragment = document.createElement('main');
    mockLoadFragment.mockResolvedValue(mockFragment);

    // Execute footer decoration
    await footerDecorate(blockElement);

    // Verify structure is still created even with empty fragment
    const footerDiv = blockElement.querySelector('div');
    expect(footerDiv).toBeTruthy();
    expect(footerDiv.children.length).toBe(0);

    // Verify original content was cleared
    expect(blockElement.textContent).toBe('');
  });

  test('should handle fragment loading errors', async () => {
    mockGetMetadata.mockReturnValue('/footer');

    // Setup mock to reject
    mockLoadFragment.mockRejectedValue(new Error('Failed to load fragment'));

    // Execute footer decoration and expect it to handle errors
    await expect(footerDecorate(blockElement)).rejects.toThrow('Failed to load fragment');

    // Verify original content was still cleared
    expect(blockElement.textContent).toBe('');
  });

  test('should preserve block structure and classes', async () => {
    // Add additional classes to block
    blockElement.classList.add('custom-footer', 'large');
    blockElement.setAttribute('data-block-status', 'loaded');

    mockGetMetadata.mockReturnValue('/footer');

    const mockFragment = document.createElement('main');
    mockFragment.innerHTML = '<div class="footer-content">Footer</div>';
    mockLoadFragment.mockResolvedValue(mockFragment);

    // Execute footer decoration
    await footerDecorate(blockElement);

    // Verify block classes and attributes are preserved
    expect(blockElement.classList.contains('footer')).toBe(true);
    expect(blockElement.classList.contains('block')).toBe(true);
    expect(blockElement.classList.contains('custom-footer')).toBe(true);
    expect(blockElement.classList.contains('large')).toBe(true);
    expect(blockElement.getAttribute('data-block-status')).toBe('loaded');

    // Verify content structure
    const footerDiv = blockElement.querySelector('div');
    expect(footerDiv).toBeTruthy();
    expect(footerDiv.querySelector('.footer-content')).toBeTruthy();
  });
});