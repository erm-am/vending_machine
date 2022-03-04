module.exports = {
  preset: "ts-jest",
  testMatch: ["**/?(*.)spec.ts?(x)"],
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
      diagnostics: false,
    },
  },
};
