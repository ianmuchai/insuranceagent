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
test("leads page exposes csv and excel upload control", async () => {
  globalThis.location = { href: "https://bizyako.local/?view=leads" };
  globalThis.history = { replaceState() {}, pushState() {} };
  globalThis.addEventListener = () => {};
  const app = { innerHTML: "" };
  globalThis.document = {
    querySelector: (selector) => (selector === "#app" ? app : null),
    querySelectorAll: () => [],
  };

  await import(`../src/app.mjs?case=${Date.now()}-leads`);

  assert.equal(app.innerHTML.includes('type="file"'), true);
  assert.equal(app.innerHTML.includes('accept=".csv,.xls,.xlsx"'), true);
});
test("top history controls use back and next labels", async () => {
  globalThis.location = { href: "https://bizyako.local/" };
  globalThis.history = { replaceState() {}, pushState() {} };
  globalThis.addEventListener = () => {};
  const app = { innerHTML: "" };
  globalThis.document = {
    querySelector: (selector) => (selector === "#app" ? app : null),
    querySelectorAll: () => [],
  };

  await import(`../src/app.mjs?case=${Date.now()}-history-labels`);

  assert.equal(app.innerHTML.includes('data-history="back" aria-label="back">back</button>'), true);
  assert.equal(app.innerHTML.includes('data-history="next" aria-label="next">next</button>'), true);
});

test("sidebar tabs render route-specific color classes", async () => {
  globalThis.location = { href: "https://bizyako.local/" };
  globalThis.history = { replaceState() {}, pushState() {} };
  globalThis.addEventListener = () => {};
  const app = { innerHTML: "" };
  globalThis.document = {
    querySelector: (selector) => (selector === "#app" ? app : null),
    querySelectorAll: () => [],
  };

  await import(`../src/app.mjs?case=${Date.now()}-nav-colors`);

  assert.equal(app.innerHTML.includes('nav-item nav-dashboard active'), true);
  assert.equal(app.innerHTML.includes('nav-item nav-leads'), true);
  assert.equal(app.innerHTML.includes('nav-item nav-renewals'), true);
});
