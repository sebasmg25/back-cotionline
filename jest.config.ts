import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['<rootDir>/tests/**/*.spec.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json'
    }]
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/contexts/**/useCases/**/*.ts',
    '!src/contexts/**/domain/**/*.ts',
    '!src/contexts/**/infraestructure/**/*.ts'
  ],
  coverageReporters: ['lcov', 'text', 'html'],
  clearMocks: true
};

export default config;
