global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

const mockDb = {
  query: jest.fn().mockResolvedValue({ rows: [] }),
  end: jest.fn(),
  connect: jest.fn()
};

jest.mock('@/db/db', () => mockDb);

const originalWarn = console.warn;
console.warn = (...args) => {
  if (args[0].includes('punycode')) return;
  originalWarn.apply(console, args);
};

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
