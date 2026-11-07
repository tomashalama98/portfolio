const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  timeout: 15000,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    browserName: "chromium",
    screenshot: "only-on-failure",
  },
});
