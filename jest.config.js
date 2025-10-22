export default {
  preset: "jest-expo", // o 'ts-jest' si no usas Expo
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testPathIgnorePatterns: ["/node_modules/", "/build/", "/dist/"],
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?@?react-native|expo(nent)?|@expo(nent)?/.*|@react-native(-community)?/.*)",
  ],
};
