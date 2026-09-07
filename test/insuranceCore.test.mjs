import test from "node:test";
import assert from "node:assert/strict";
import {
  buildDashboardMetrics,
  buildRenewalRows,
  buildCommissionLedger,
  compareQuotes,
  markCommissionPaid,
  markReminderSent,
  normalizeRoute,
  routeFromUrl,
  moveLeadStage,
  addLead,
  seedClients,
  seedLeads,
  toggleTask,
  updateSetting,
} from "../src/insuranceCore.mjs";

test("dashboard metrics combine leads, renewals, quotes, policies, and commission", () => {
  const ledger = buildCommissionLedger(seedClients);
  const metrics = buildDashboardMetrics(seedClients, seedLeads, ledger);

  assert.equal(metrics.newLeads, 2);
  assert.equal(metrics.followUps, 2);
  assert.equal(metrics.quotesSent, 2);
  assert.equal(metrics.policiesSold, 2);
  assert.equal(metrics.renewals, 5);
  assert.equal(metrics.outstandingCommission > 0, true);
});

test("renewal rows are sorted by urgency and include overdue policies", () => {
  const rows = buildRenewalRows(seedClients);

  assert.equal(rows[0].clientName, "Samuel Kiptoo");
  assert.equal(rows[0].daysLeft < 0, true);
  assert.equal(rows.filter((row) => row.daysLeft >= 0 && row.daysLeft <= 30).length, 5);
});

test("quote comparison ranks insurers by estimated premium and highlights commission", () => {
  const results = compareQuotes("motor", 1500000);

  assert.equal(results[0].insurer, "Madison");
  assert.equal(results[0].badges.includes("Lowest premium"), true);
  assert.equal(results.some((row) => row.badges.includes("Best commission")), true);
});

test("lead pipeline movement is clamped to valid stages", () => {
  const movedForward = moveLeadStage(seedLeads, "l1", 1);
  const movedBack = moveLeadStage(movedForward, "l1", -5);

  assert.equal(movedForward.find((lead) => lead.id === "l1").stage, "Follow Up");
  assert.equal(movedBack.find((lead) => lead.id === "l1").stage, "New");
});

test("new leads receive a stable next id and default to New stage", () => {
  const leads = addLead(seedLeads, {
    name: "Kevin Omondi",
    product: "Motor Insurance - Private Car",
    value: 78000,
    source: "WhatsApp",
  });

  assert.equal(leads.length, seedLeads.length + 1);
  assert.deepEqual(leads.at(-1), {
    id: "l7",
    name: "Kevin Omondi",
    product: "Motor Insurance - Private Car",
    value: 78000,
    source: "WhatsApp",
    stage: "New",
    lastContact: "Just now",
  });
});


test("client actions update reminders, commissions, tasks, and settings immutably", () => {
  const reminders = markReminderSent({}, "p1", "sms");
  const ledger = markCommissionPaid(buildCommissionLedger(seedClients), "cm-p8");
  const tasks = toggleTask([{ id: "t1", done: false }], "t1", true);
  const settings = updateSetting({ smsReminders: true }, "smsReminders", false);

  assert.equal(reminders["p1:sms"], true);
  assert.equal(ledger.find((row) => row.id === "cm-p8").status, "Paid");
  assert.equal(ledger.find((row) => row.id === "cm-p8").paid, ledger.find((row) => row.id === "cm-p8").expected);
  assert.deepEqual(tasks, [{ id: "t1", done: true }]);
  assert.deepEqual(settings, { smsReminders: false });
});
test("browser routes normalize valid tabs and fall back to dashboard", () => {
  assert.equal(normalizeRoute("renewals"), "renewals");
  assert.equal(normalizeRoute("missing"), "dashboard");
  assert.equal(routeFromUrl("https://example.test/?view=clients"), "clients");
  assert.equal(routeFromUrl("https://example.test/?view=not-real"), "dashboard");
});