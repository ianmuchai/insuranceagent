import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

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
test("sidebar tab colors use unique vibrant spectrum values", () => {
  const css = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");
  const matches = [...css.matchAll(/\.nav-[a-z]+ \{ --tab-color: (#(?:[0-9a-fA-F]{6})); \}/g)];
  const colors = matches.map((match) => match[1].toLowerCase());

  assert.equal(colors.length, 11);
  assert.equal(new Set(colors).size, 11);
  assert.deepEqual(colors, [
    "#00e676",
    "#00b0ff",
    "#7c4dff",
    "#ffab00",
    "#00e5ff",
    "#536dfe",
    "#ff4081",
    "#ff1744",
    "#18ffff",
    "#76ff03",
    "#ffea00",
  ]);
});
