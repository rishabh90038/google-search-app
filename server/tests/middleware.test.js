require("dotenv").config();

describe("Middleware Tests", () => {
  test("should have authentication middleware", () => {
    const auth = require("../middleware/auth");
    expect(typeof auth).toBe("function");
  });

  test("should have error handler middleware", () => {
    const errorHandler = require("../middleware/errorHandler");
    expect(typeof errorHandler).toBe("function");
  });
});
