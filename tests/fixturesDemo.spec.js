const { customTest } = require("./utils/fixtures.js");

customTest("Fixture Demo", async ({ authenticatePage }) => {
  await authenticatePage.goto("https://rahulshettyacademy.com/client");
});