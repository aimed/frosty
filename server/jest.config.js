module.exports = {
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js"
  ],
  "transform": {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  "globals": {
    "ts-jest": {
      "tsConfigFile": "tsconfig.json"
    }
  },
  "testMatch": [
    "**/src/**/__tests__/*.test.(ts|tsx|js)"
  ],
  "globalSetup": "./__tests__/setup.js",
  "globalTeardown": "./__tests__/teardown.js",
  "testEnvironment": "./__tests__/mongo-environment.js"
}
