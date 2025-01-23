// src/tests/setupTests.js

// TextEncoder/Decoder polyfills
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

// Mock database
jest.mock('@/db/db', () => ({
  query: jest.fn().mockResolvedValue({ rows: [] }),
  end: jest.fn(),
  connect: jest.fn(),
}));

// Suppress specific warnings
const originalWarn = console.warn;
console.warn = (...args) => {
  if (args[0].includes('punycode')) return;
  originalWarn.apply(console, args);
};

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
