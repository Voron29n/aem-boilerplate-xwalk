/**
 * Jest setup file for Adobe EDS project
 * This file runs before each test to set up the testing environment
 */

// Mock browser globals that are expected by AEM modules
global.window = global.window || {};
global.document = global.document || {};
global.navigator = global.navigator || {
  sendBeacon: jest.fn(),
};
global.sessionStorage = global.sessionStorage || {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = global.localStorage || {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Mock window.hlx object that's used throughout AEM scripts
global.window.hlx = {
  codeBasePath: '',
  lighthouse: false,
  RUM_MASK_URL: 'full',
  RUM_MANUAL_ENHANCE: true,
  rum: {
    weight: 100,
    id: 'test',
    isSelected: false,
    firstReadTime: Date.now(),
    queue: [],
    collector: jest.fn(),
  },
};

// Mock performance API
global.window.performance = {
  now: jest.fn(() => Date.now()),
  timeOrigin: Date.now(),
};

// Mock fetch for API calls
global.fetch = jest.fn();

// Setup DOM environment
beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks();
  
  // Reset DOM
  document.body.innerHTML = '';
  document.head.innerHTML = '';
  
  // Reset window.hlx to default state
  global.window.hlx = {
    codeBasePath: '',
    lighthouse: false,
    RUM_MASK_URL: 'full',
    RUM_MANUAL_ENHANCE: true,
    rum: {
      weight: 100,
      id: 'test',
      isSelected: false,
      firstReadTime: Date.now(),
      queue: [],
      collector: jest.fn(),
    },
  };
});