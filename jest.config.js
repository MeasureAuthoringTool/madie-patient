module.exports = {
  roots: ["<rootDir>"],
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(j|t)sx?$": "babel-jest",
  },
  transformIgnorePatterns: ["node_modules/(?!formik)/"],
  moduleNameMapper: {
    "single-spa-react/parcel": "single-spa-react/lib/cjs/parcel.cjs",
    "\\.(css|scss)$": "identity-obj-proxy",
    "@madie/madie-components":
      "<rootDir>/node_modules/@madie/madie-components/src/madie-madie-components.tsx",
  },
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
  globals: {
    "ts-jest": {
      tsconfig: {
        jsx: "react-jsx",
      },
      useEsm: true,
    },
  },
  testTimeout: 20000,
};
