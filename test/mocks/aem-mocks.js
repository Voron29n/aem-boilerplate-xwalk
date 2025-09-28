/**
 * Mock implementations for AEM-specific utilities
 * These mocks provide test-friendly implementations of AEM functions
 */

// Mock loadFragment function used by blocks
export const mockLoadFragment = jest.fn().mockResolvedValue((() => {
  const main = document.createElement('main');
  main.innerHTML = '<div class="section"><p>Mocked fragment content</p></div>';
  return main;
})());

// Mock getMetadata function
export const mockGetMetadata = jest.fn().mockImplementation((name) => {
  const mockMetadata = {
    footer: '/footer',
    template: 'default',
    theme: 'default',
  };
  return mockMetadata[name] || '';
});

// Mock decorateMain function
export const mockDecorateMain = jest.fn();

// Mock loadSections function
export const mockLoadSections = jest.fn().mockResolvedValue(undefined);

// Mock CSS loading
export const mockLoadCSS = jest.fn().mockResolvedValue(undefined);

// Mock script loading
export const mockLoadScript = jest.fn().mockResolvedValue(undefined);

// Mock sampleRUM function
export const mockSampleRUM = jest.fn();

// Mock setup function
export const mockSetup = jest.fn();

// Helper to create mock DOM elements for testing
export const createMockElement = (tagName, attributes = {}, children = []) => {
  const element = document.createElement(tagName);

  // Set attributes
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });

  // Add children
  children.forEach((child) => {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else {
      element.appendChild(child);
    }
  });

  return element;
};

// Mock block element factory
export const createMockBlock = (blockName, content = [[]]) => {
  const block = document.createElement('div');
  block.classList.add(blockName, 'block');
  block.dataset.blockName = blockName;
  block.dataset.blockStatus = 'initialized';

  content.forEach((row) => {
    const rowEl = document.createElement('div');
    row.forEach((col) => {
      const colEl = document.createElement('div');
      if (typeof col === 'string') {
        colEl.textContent = col;
      } else if (col) {
        colEl.appendChild(col);
      }
      rowEl.appendChild(colEl);
    });
    block.appendChild(rowEl);
  });

  return block;
};

// Mock section element factory
export const createMockSection = (blocks = []) => {
  const section = document.createElement('div');
  section.classList.add('section');
  section.dataset.sectionStatus = 'initialized';

  blocks.forEach((block) => {
    const wrapper = document.createElement('div');
    wrapper.appendChild(block);
    section.appendChild(wrapper);
  });

  return section;
};

// Reset all mocks
export const resetAllMocks = () => {
  mockLoadFragment.mockClear();
  mockGetMetadata.mockClear();
  mockDecorateMain.mockClear();
  mockLoadSections.mockClear();
  mockLoadCSS.mockClear();
  mockLoadScript.mockClear();
  mockSampleRUM.mockClear();
  mockSetup.mockClear();
};
