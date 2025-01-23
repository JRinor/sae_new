import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  dir: './'
})

/** @type {import('jest').Config} */
const config = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/src/tests/setupTests.js'],
  moduleFileExtensions: ['js', 'jsx', 'json', 'node']
}

export default createJestConfig(config)
