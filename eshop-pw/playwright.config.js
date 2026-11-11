// @ts-check
const { defineConfig } = require("@playwright/test");

const isCI = !!process.env.CI;

module.exports = defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  workers: isCI ? 2 : 3,
  reporter: [
    ["list"],
    ["html", { open: "never" }],
    ["json", { outputFile: "results.json" }],
  ],
  use: {
    baseURL: process.env.BASE_URL || "https://automationexercise.com",
    browserName: "chromium",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    locale: "en-US",
  },
});
