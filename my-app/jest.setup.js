import '@testing-library/jest-dom';
import { act } from '@testing-library/react';

global.Response = jest.fn((body, init) => ({
  json: () => Promise.resolve(typeof body === 'string' ? JSON.parse(body) : body),
  status: init?.status || 200,
  headers: new Map()
}));

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
    };
  },
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "",
}));

jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: function DynamicComponent(props) {
    const { children, ...rest } = props;
    return children || null;
  },
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
    ok: true,
    status: 200,
  })
);

const originalError = console.error;
console.error = (...args) => {
  if (
    /Warning.*not wrapped in act/.test(args[0]) ||
    /Warning.*Legacy context API/.test(args[0]) ||
    /Warning.*ReactDOM.render is no longer supported/.test(args[0])
  ) {
    return;
  }
  originalError.call(console, ...args);
};

afterEach(() => {
  jest.clearAllMocks();
});
