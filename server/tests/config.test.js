require("dotenv").config();

describe("Backend Tests", () => {
  test("should have proper environment setup", () => {
    expect(process.env.NODE_ENV).toBeDefined();
  });

  test("should have required environment variables", () => {
    expect(process.env.JWT_SECRET).toBeDefined();
    expect(process.env.GOOGLE_API_KEY).toBeDefined();
    expect(process.env.GOOGLE_CSE_ID).toBeDefined();
  });

  test("should have proper package.json configuration", () => {
    const packageJson = require("../package.json");
    expect(packageJson.name).toBe("google-search-app-server");
    expect(packageJson.scripts.test).toBe("jest");
  });
});
