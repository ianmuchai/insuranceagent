import test from "node:test";
import assert from "node:assert/strict";

test("renewals table separates renewal date, days, and status columns", async () => {
  globalThis.location = { href: "https://bizyako.local/?view=renewals" };
  globalThis.history = { replaceState() {}, pushState() {} };
  globalThis.addEventListener = () => {};
  const app = { innerHTML: "" };
  globalThis.document = {
    querySelector: (selector) => (selector === "#app" ? app : null),
    querySelectorAll: () => [],
  };

  await import(`../src/app.mjs?case=${Date.now()}`);

  assert.equal(app.innerHTML.includes("<th>Renews</th><th>Days</th><th>Status</th>"), true);
});
