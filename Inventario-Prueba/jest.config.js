/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/tests"], // 👈 Indica explícitamente la carpeta de tests
  testMatch: ["**/?(*.)+(spec|test).[tj]s?(x)"], // 👈 Detecta *.test.ts y *.spec.ts
  moduleFileExtensions: ["ts", "js", "json", "node"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  verbose: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
};

