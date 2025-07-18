require("dotenv").config();

describe("Database Tests", () => {
  test("should have mongoose connection string", () => {
    expect(process.env.MONGODB_URI).toBeDefined();
  });

  test("should have admin JWT configured", () => {
    expect(process.env.ADMIN_JWT).toBeDefined();
  });
});
