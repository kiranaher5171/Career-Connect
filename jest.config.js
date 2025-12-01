module.exports = {
  verbose: true,
    transform: {
      "^.+\\.jsx?$": ["babel-jest", { configFile: "./babel-jest.config.js" }]
    },
    moduleNameMapper: {
      "\\.(css|less|scss|sass)$": "identity-obj-proxy",
      "\\.(gif|ttf|eot|svg|png)$": "jest-transform-stub",
      '^@/(.*)$': '<rootDir>/src/$1',
    },
    testEnvironment: "jest-environment-jsdom",
    reporters: [
      "default",
      ["jest-html-reporter", {
        "pageTitle": "Test Report",
        "outputPath": "test-report.html",
        "includeFailureMsg": true,
        "includeConsoleLog": false
      }]
    ]
  };