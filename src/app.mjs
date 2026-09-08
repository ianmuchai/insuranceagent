import {
  addLead,
  buildCommissionLedger,
  buildContactLinks,
  buildDashboardMetrics,
  buildEmployeeReports,
  buildNotificationQueue,
  buildRenewalRows,
  compareQuotes,
  fmtDate,
  insurers,
  markCommissionPaid,
  markReminderSent,
  routeFromUrl,
  renewalStatus,
  fmtKES,
  moveLeadStage,
  pipelineStages,
  seedClients,
  seedEmployees,
  seedLeads,
  toggleTask,
  updateAgentProfile,
  updateSetting,
} from "./insuranceCore.mjs";

const state = {
  active: routeFromUrl(globalThis.location?.href || "https://bizyako.local/"),
  clients: structuredClone(seedClients),
  leads: structuredClone(seedLeads),
  ledger: buildCommissionLedger(seedClients),
  reminders: {},
  sentNotifications: {},
  renewalFilter: "30",
  quoteType: "motor",
  quoteSum: 1500000,
  quoteResults: compareQuotes("motor", 1500000),
  clientQuery: "",
  selectedClientId: seedClients[0].id,
  agentProfile: { name: "Peter Agent", role: "Admin" },
  profileOpen: false,
  tasks: [
    { id: "t1", label: "Call Peter Mwangi (Motor Insurance Lead)", time: "10:30 AM", done: false },
    { id: "t2", label: "Send quotation to Kevin Omondi", time: "12:00 PM", done: false },
    { id: "t3", label: "Follow up with Jane Njeri (Medical)", time: "3:00 PM", done: false },
  ],
  settings: {
    whatsappCapture: true,
    smsReminders: true,
    commissionTracking: true,
    quoteSummaries: false,
  },
  notice: "All systems ready.",
};

function routeUrl(route) {
  const url = new URL(globalThis.location?.href || "https://bizyako.local/");
  if (route === "dashboard") {
    url.searchParams.delete("view");
  } else {
    url.searchParams.set("view", route);
  }
  return `${url.pathname}${url.search}${url.hash}`;
}

function navigateTo(route, options = {}) {
  state.active = route;
  if (globalThis.history) {
    const nextUrl = routeUrl(route);
    if (options.replace) {
      globalThis.history.replaceState({ view: route }, "", nextUrl);
    } else {
      globalThis.history.pushState({ view: route }, "", nextUrl);
    }
  }
  render();
}

if (globalThis.history) {
  globalThis.history.replaceState({ view: state.active }, "", routeUrl(state.active));
}

if (globalThis.addEventListener) {
  globalThis.addEventListener("popstate", () => {
    state.active = routeFromUrl(globalThis.location.href);
    render();
  });
}
const navItems = [
  ["dashboard", "Dashboard", "home"],
  ["leads", "Leads", "users"],
  ["pipeline", "Pipeline", "pipeline"],
  ["renewals", "Renewals", "calendar"],
  ["clients", "Clients", "clients"],
  ["quotes", "Quotes", "quote"],
  ["commissions", "Commissions", "wallet"],
  ["notifications", "Notifications", "bell"],
  ["tasks", "Tasks", "tasks"],
  ["reports", "Reports", "reports"],
  ["settings", "Settings", "settings"],
];

function stepRoute(direction) {
  const index = navItems.findIndex(([id]) => id === state.active);
  const nextIndex = (index + direction + navItems.length) % navItems.length;
  navigateTo(navItems[nextIndex][0]);
}

function profileEditor() {
  return `<form class="profile-editor"><label>Name<input name="name" value="${state.agentProfile.name}" /></label><label>Role<select name="role"><option value="Admin" ${state.agentProfile.role === "Admin" ? "selected" : ""}>Admin</option><option value="User" ${state.agentProfile.role === "User" ? "selected" : ""}>User</option></select></label><button class="primary alt" type="submit">Save profile</button></form>`;
}
const icon = {
  home: '<svg viewBox="0 0 24 24"><path d="M3 11.5 12 4l9 7.5"/><path d="M5 10.5V20h14v-9.5"/><path d="M9 20v-6h6v6"/></svg>',
  users: '<svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9.5" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  pipeline: '<svg viewBox="0 0 24 24"><path d="M4 6h6"/><path d="M14 6h6"/><path d="M4 12h16"/><path d="M4 18h10"/><circle cx="11" cy="6" r="1.5"/><circle cx="15" cy="18" r="1.5"/></svg>',
  calendar: '<svg viewBox="0 0 24 24"><path d="M8 2v4"/><path d="M16 2v4"/><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18"/></svg>',
  clients: '<svg viewBox="0 0 24 24"><path d="M16 11a4 4 0 1 0-8 0"/><path d="M4 21a8 8 0 0 1 16 0"/><path d="M12 2v3"/></svg>',
  quote: '<svg viewBox="0 0 24 24"><path d="M7 3h10l3 4v14H4V3h3z"/><path d="M8 12h8"/><path d="M8 16h6"/><path d="M15 3v5h5"/></svg>',
  wallet: '<svg viewBox="0 0 24 24"><path d="M3 7h18v13H3z"/><path d="M3 7l3-4h13l2 4"/><path d="M16 14h5"/></svg>',
  tasks: '<svg viewBox="0 0 24 24"><path d="M9 6h11"/><path d="M9 12h11"/><path d="M9 18h11"/><path d="m4 6 1 1 2-2"/><path d="m4 12 1 1 2-2"/><path d="m4 18 1 1 2-2"/></svg>',
  reports: '<svg viewBox="0 0 24 24"><path d="M4 19V5"/><path d="M4 19h16"/><path d="M8 16v-5"/><path d="M13 16V8"/><path d="M18 16v-7"/></svg>',
  settings: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.12 2.12-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1 1.55V20h-3v-.09a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.88.34l-.06.06-2.12-2.12.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.55-1H3v-3h.09a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.12-2.12.06.06A1.7 1.7 0 0 0 8.3 5.4a1.7 1.7 0 0 0 1-1.55V3h3v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.12 2.12-.06.06A1.7 1.7 0 0 0 19.4 9c.25.6.84 1 1.55 1H21v3h-.09a1.7 1.7 0 0 0-1.51 1z"/></svg>',
  bell: '<svg viewBox="0 0 24 24"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
};

function render() {
  const metrics = buildDashboardMetrics(state.clients, state.leads, state.ledger);
  const notifications = buildNotificationQueue({ clients: state.clients, leads: state.leads, ledger: state.ledger });
  document.querySelector("#app").innerHTML = `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="brand"><span>Biz<span>Yako</span></span></div>
        <nav>${navItems.map(([id, label, key]) => `
          <button class="nav-item ${state.active === id ? "active" : ""}" data-nav="${id}">
            ${icon[key]}<span>${label}</span>
          </button>`).join("")}</nav>
        <button class="agent-card" data-profile-toggle><div class="avatar">${state.agentProfile.name.charAt(0).toUpperCase()}</div><div><strong>${state.agentProfile.name}</strong><small>${state.agentProfile.role} - Edit profile</small></div></button>
        ${state.profileOpen ? profileEditor() : ""}
      </aside>
      <main class="main">
        <header class="topbar">
          <div><h1>${state.active === "dashboard" ? "Welcome back, Peter!" : titleFor(state.active)}</h1><p>${subtitleFor(state.active)}</p></div>
          <div class="top-actions"><button class="arrow-btn" data-history="back" aria-label="Back">Back</button><button class="arrow-btn" data-history="next" aria-label="Next">Next</button><button class="date-btn" data-nav="reports">${icon.calendar} 6 Sep - 6 Oct 2026</button><button class="bell" data-nav="notifications" aria-label="Open notifications">${notifications.filter((item) => !state.sentNotifications[item.id]).length}</button></div>
        </header>
        <div class="notice" role="status">${state.notice}</div>
        ${state.active === "dashboard" ? dashboard(metrics) : ""}
        ${state.active === "leads" ? leadsView() : ""}
        ${state.active === "pipeline" ? pipelineView() : ""}
        ${state.active === "renewals" ? renewalsView() : ""}
        ${state.active === "clients" ? clientsView() : ""}
        ${state.active === "quotes" ? quotesView() : ""}
        ${state.active === "commissions" ? commissionsView() : ""}
        ${state.active === "notifications" ? notificationsView(notifications) : ""}
        ${state.active === "tasks" ? tasksView() : ""}
        ${state.active === "reports" ? reportsView(metrics) : ""}
        ${state.active === "settings" ? settingsView() : ""}
      </main>
    </div>`;
  bindEvents();
}

function titleFor(id) {
  return { leads: "Leads", pipeline: "Pipeline", renewals: "Renewals", clients: "Clients", quotes: "Quote Comparison", commissions: "Commissions", notifications: "Notifications", tasks: "Tasks", reports: "Reports", settings: "Settings" }[id];
}

function subtitleFor(id) {
  return {
    dashboard: "Here is what is happening with your insurance business today.",
    leads: "Capture, qualify, and follow up with prospects from one desk.",
    pipeline: "Move opportunities forward without duplicating the leads module.",
    renewals: "See urgent renewals and send reminders before policies lapse.",
    clients: "All client, dependent, policy, and claim details in one place.",
    quotes: "Compare premiums and commission across insurers.",
    commissions: "Track what has been paid and what is still owed.",
    tasks: "Today's follow-ups and renewal actions.",
    reports: "Per-employee production, pipeline, commission, and renewal workload.",
    notifications: "Automatic reminders for expiry, referrals, renewals, and overdue commission.",
    settings: "Workspace preferences for the agent desk.",
  }[id];
}

function statCards(metrics) {
  const cards = [
    ["New Leads", metrics.newLeads, "18% vs last 30 days", "green", "leads"],
    ["Follow Ups", metrics.followUps, "Due this week", "blue", "pipeline"],
    ["Quotes Sent", metrics.quotesSent, "12% vs last 30 days", "violet", "quotes"],
    ["Policies Sold", metrics.policiesSold, "10% vs last 30 days", "green", "clients"],
    ["Renewals", metrics.renewals, "Expiring in 30 days", "amber", "renewals"],
  ];
  return cards.map(([label, value, note, tone, route]) => `<button class="stat-card ${tone}" data-nav="${route}"><small>${label}</small><strong>${value}</strong><span>${note}</span></button>`).join("");
}

function dashboard(metrics) {
  return `
    <section class="stats-grid">${statCards(metrics)}</section>
    <section class="dashboard-grid">
      <article class="panel">
        <div class="panel-title">Pipeline Overview</div>
        <div class="donut-row">
          <div class="donut"><span>Total Leads<br><b>${metrics.totalLeads}</b></span></div>
          <div class="legend">${pipelineStages.map((stage) => {
            const count = state.leads.filter((lead) => lead.stage === stage).length;
            return `<div><i></i><span>${stage}</span><b>${count}</b></div>`;
          }).join("")}</div>
        </div>
      </article>
      <article class="panel">
        <div class="panel-title">Upcoming Renewals <button data-nav="renewals">View all</button></div>
        ${renewalCards(buildRenewalRows(state.clients).filter((row) => row.daysLeft >= 0).slice(0, 3))}
      </article>
      <article class="panel">
        <div class="panel-title">Tasks for Today <button data-nav="tasks">View all</button></div>
        ${taskList(state.tasks.slice(0, 3))}
      </article>
      <article class="panel ai-panel"><div class="spark">*</div><strong>AI Assistant</strong><p>You have ${state.leads.filter((lead) => lead.stage === "New").length} new leads, ${metrics.renewals} upcoming renewals, and ${buildNotificationQueue({ clients: state.clients, leads: state.leads, ledger: state.ledger }).length} automatic alerts.</p><button data-nav="notifications">View Notifications</button></article>
    </section>`;
}

function renewalCards(rows) {
  return rows.map((row) => `<div class="renewal-card">
    <div><strong>${row.clientName}</strong><span>${row.type} Insurance - ${row.insurer}</span><small>${row.daysLeft} days left</small></div>
    <div><b class="${row.daysLeft <= 7 ? "danger" : row.daysLeft <= 14 ? "warn" : "ok"}">${row.daysLeft} days</b><small>${fmtDate(row.nextRenewal)}</small></div>
  </div>`).join("");
}

function leadsView() {
  return `<section class="work-split"><article class="panel">
    <div class="panel-title">Lead Capture</div>
    <form class="lead-form">
      <input name="name" placeholder="Client name" required />
      <input name="product" placeholder="Insurance need" />
      <input name="value" type="number" placeholder="Estimated premium" />
      <input name="source" placeholder="Source e.g. WhatsApp" />
      <button class="primary" type="submit">Add lead</button>
    </form>
  </article><article class="panel"><div class="panel-title">Recent Leads</div>${state.leads.map(leadRow).join("")}</article></section>`;
}

function leadRow(lead) {
  return `<div class="data-row"><div><strong>${lead.name}</strong><span>${lead.product}</span></div><div><b>${fmtKES(lead.value)}</b><small>${lead.stage}</small></div></div>`;
}

function pipelineView() {
  return `<section class="kanban">${pipelineStages.map((stage) => `
    <article class="kanban-col"><div class="kanban-title">${stage} (${state.leads.filter((lead) => lead.stage === stage).length})</div>
      ${state.leads.filter((lead) => lead.stage === stage).map((lead) => `
        <div class="lead-card"><strong>${lead.name}</strong><span>${lead.product}</span><small>${lead.lastContact}</small>
          <div><button data-move="${lead.id}" data-dir="-1" aria-label="Move lead back">&lt;</button><button data-move="${lead.id}" data-dir="1" aria-label="Move lead forward">&gt;</button></div>
        </div>`).join("") || '<div class="empty">Empty</div>'}
    </article>`).join("")}</section>`;
}

function renewalsView() {
  const rows = buildRenewalRows(state.clients).filter((row) => state.renewalFilter === "all" || (state.renewalFilter === "overdue" && row.daysLeft < 0) || (row.daysLeft >= 0 && row.daysLeft <= Number(state.renewalFilter)));
  const filters = [["7", "Next 7 days"], ["14", "Next 14 days"], ["30", "Next 30 days"], ["overdue", "Overdue"], ["all", "All"]];
  return `<section class="panel"><div class="filters">${filters.map(([filter, label]) => `<button class="${state.renewalFilter === filter ? "selected" : ""}" data-renewal-filter="${filter}">${label}</button>`).join("")}</div>${table(["Client", "Policy", "Insurer", "Premium", "Renews", "Reminder"], rows.map((row) => [
    `<strong>${row.clientName}</strong><small>${row.phone}</small>`,
    row.type,
    row.insurer,
    fmtKES(row.premium),
    `<span>${fmtDate(row.nextRenewal)}</span><b class="${renewalStatus(row.daysLeft).tone}">${renewalStatus(row.daysLeft).label}</b><small>${renewalStatus(row.daysLeft).tone === "danger" ? "Action needed" : renewalStatus(row.daysLeft).tone === "warn" ? "Watch" : "Healthy"}</small>`,
    `<div class="action-stack"><button data-reminder="${row.id}:sms">${state.reminders[`${row.id}:sms`] ? "SMS sent" : "Send SMS"}</button><button data-reminder="${row.id}:email">${state.reminders[`${row.id}:email`] ? "Email sent" : "Send email"}</button></div>`,
  ]))}</section>`;
}

function clientContactActions(client, label = "") {
  const links = buildContactLinks(client, `Hello ${client.name}, this is Peter from BizYako Insurance Agent OS. I am reaching out about your insurance record.`);
  return `<div class="contact-actions ${label ? "compact" : ""}"><a href="${links.whatsappUrl}" target="_blank" rel="noopener" data-contact="whatsapp:${client.id}">${label || "WhatsApp"}</a><a href="${links.smsUrl}" data-contact="sms:${client.id}">${label ? "SMS" : "Message"}</a></div>`;
}

function clientsView() {
  const filtered = state.clients.filter((client) => `${client.name} ${client.phone}`.toLowerCase().includes(state.clientQuery.toLowerCase()));
  const selected = state.clients.find((client) => client.id === state.selectedClientId) || filtered[0];
  return `<section class="crm-layout"><article class="panel client-list"><input class="search" value="${state.clientQuery}" placeholder="Search clients" />
    ${filtered.map((client) => `<div class="client-list-row"><button data-client="${client.id}" class="${selected?.id === client.id ? "selected" : ""}"><strong>${client.name}</strong><span>${client.policies.length} policies</span></button>${clientContactActions(client, "WhatsApp")}</div>`).join("")}</article>
    <article class="panel client-detail">${selected ? `<div class="client-detail-head"><div><h2>${selected.name}</h2><p>${selected.phone}</p></div>${clientContactActions(selected)}</div>${table(["Type", "Provider", "Sum insured", "Premium", "Renews"], selected.policies.map((policy) => [policy.type, policy.insurer, fmtKES(policy.sumInsured), fmtKES(policy.premium), fmtDate(policy.nextRenewal)]))}<h3>Dependents</h3><p>${selected.dependents.join(", ") || "None on record"}</p><h3>Claims</h3><p>${selected.claims.map((claim) => `${fmtDate(claim.date)} - ${claim.type} (${claim.status})`).join("<br>") || "No claims filed"}</p>` : ""}</article></section>`;
}

function quotesView() {
  const selected = (value) => (state.quoteType === value ? "selected" : "");
  return `<section class="panel"><form class="quote-form"><label>Product<select name="type"><option value="motor" ${selected("motor")}>Motor</option><option value="medical" ${selected("medical")}>Medical</option><option value="life" ${selected("life")}>Life</option></select></label><label>Sum insured<input name="sum" type="number" min="100000" step="50000" value="${state.quoteSum}" /></label><button class="primary" type="submit">Compare</button></form>${table(["Insurer", "Estimated premium", "Your commission", "Notes"], state.quoteResults.map((row) => [row.insurer, fmtKES(row.premium), fmtKES(row.commission), row.badges.map((badge) => `<b class="badge">${badge}</b>`).join(" ")]))}</section>`;
}

function commissionsView() {
  return `<section class="panel">${table(["Client", "Insurer", "Premium", "Rate", "Expected", "Paid", "Status", ""], state.ledger.map((row) => [
    `<strong>${row.clientName}</strong><small>${row.policyType}</small>`,
    row.insurer,
    fmtKES(row.premium),
    `${(row.rate * 100).toFixed(1)}%`,
    fmtKES(row.expected),
    fmtKES(row.paid),
    `<b class="${row.status === "Overdue" ? "danger" : row.status === "Paid" ? "ok" : "warn"}">${row.status}</b>`,
    row.status === "Paid" ? "" : `<button data-paid="${row.id}">Mark paid</button>`,
  ]))}</section>`;
}

function notificationActions(item) {
  const client = state.clients.find((record) => record.id === item.clientId);
  return client ? clientContactActions(client) : "";
}

function notificationsView(notifications) {
  const rows = notifications.map((item) => `<article class="notification-card ${item.urgency}"><div><small>${item.type.replaceAll("_", " ")}</small><strong>${item.title}</strong><p>${item.detail}</p><span>Parties: ${item.relevantParties.join(", ")}</span>${notificationActions(item)}</div><button data-notification="${item.id}">${state.sentNotifications[item.id] ? "Sent" : "Mark sent"}</button></article>`).join("");
  return `<section class="notification-grid"><article class="panel notification-summary"><div class="panel-title">Automatic Notification Rules</div><div class="rule-list"><span>Policy expiry alerts for overdue policies</span><span>Renewal reminders from today through 30 days</span><span>Referral follow-up prompts for active referred leads</span><span>Commission follow-up for overdue provider payments</span></div></article><article class="panel"><div class="panel-title">Notification Queue</div>${rows || '<div class="empty">No notifications require action.</div>'}</article></section>`;
}
function tasksView() {
  return `<section class="panel">${taskList(state.tasks)}</section>`;
}

function taskList(tasks) {
  return tasks.map((task) => `<label class="task-row"><input type="checkbox" data-task="${task.id}" ${task.done ? "checked" : ""} /><span>${task.label}</span><b>${task.time}</b></label>`).join("");
}

function reportsView(metrics) {
  const employeeRows = buildEmployeeReports(seedEmployees, state.leads, state.ledger);
  return `<section class="reports-layout"><div class="stats-grid report-cards">${statCards(metrics)}<button class="stat-card teal" data-nav="notifications"><small>Alerts</small><strong>${buildNotificationQueue({ clients: state.clients, leads: state.leads, ledger: state.ledger }).length}</strong><span>Automatic notifications</span></button></div><article class="panel report-panel"><div class="panel-title">Per Employee Performance</div>${table(["Employee", "Role", "Assigned Leads", "Won", "Pipeline", "Commission Due", "Target"], employeeRows.map((row) => [`<strong>${row.name}</strong>`, row.role, row.assignedLeads, row.wonPolicies, fmtKES(row.pipelineValue), fmtKES(row.commissionDue), `<div class="progress"><span style="width:${row.targetProgress}%"></span></div><small>${row.targetProgress}%</small>`]))}</article><article class="panel report-panel"><div class="panel-title">Insurance Agent Tool Summary</div><div class="summary-grid"><div><strong>${state.clients.length}</strong><span>Clients managed</span></div><div><strong>${insurers.length}</strong><span>Insurance providers</span></div><div><strong>${metrics.policyCount}</strong><span>Policies tracked</span></div><div><strong>${fmtKES(metrics.premiumAtRisk)}</strong><span>Premium at risk</span></div></div></article></section>`;
}

function settingsView() {
  const row = (key, label) => `<label><input type="checkbox" data-setting="${key}" ${state.settings[key] ? "checked" : ""} /> ${label}</label>`;
  return `<section class="settings-page"><article class="panel settings-grid">${row("whatsappCapture", "WhatsApp lead capture")}${row("smsReminders", "SMS renewal reminders")}${row("commissionTracking", "Commission tracking")}${row("quoteSummaries", "Auto-send quote summaries")}</article><article class="panel provider-panel"><div class="panel-title">Insurance Providers Supported</div><div class="provider-grid">${insurers.map((provider) => `<div><strong>${provider.name}</strong><span>Motor ${(provider.motor * 100).toFixed(1)}%</span><span>Medical ${(provider.medical * 100).toFixed(1)}%</span><span>Life ${(provider.life * 100).toFixed(1)}%</span></div>`).join("")}</div></article></section>`;
}

function table(headers, rows) {
  return `<div class="table-wrap"><table><thead><tr>${headers.map((head) => `<th>${head}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}

function bindEvents() {
  document.querySelectorAll("[data-nav]").forEach((el) => el.addEventListener("click", () => { navigateTo(el.dataset.nav); }));
  document.querySelectorAll("[data-history]").forEach((el) => el.addEventListener("click", () => { stepRoute(el.dataset.history === "next" ? 1 : -1); }));
  document.querySelector("[data-profile-toggle]")?.addEventListener("click", () => { state.profileOpen = !state.profileOpen; render(); });
  document.querySelectorAll("[data-move]").forEach((el) => el.addEventListener("click", () => { state.leads = moveLeadStage(state.leads, el.dataset.move, Number(el.dataset.dir)); state.notice = "Lead moved."; render(); }));
  document.querySelectorAll("[data-renewal-filter]").forEach((el) => el.addEventListener("click", () => { state.renewalFilter = el.dataset.renewalFilter; render(); }));
  document.querySelectorAll("[data-reminder]").forEach((el) => el.addEventListener("click", () => { const [policyId, channel] = el.dataset.reminder.split(":"); state.reminders = markReminderSent(state.reminders, policyId, channel); state.notice = `${channel.toUpperCase()} reminder queued.`; render(); }));
  document.querySelectorAll("[data-paid]").forEach((el) => el.addEventListener("click", () => { state.ledger = markCommissionPaid(state.ledger, el.dataset.paid); state.notice = "Commission marked paid."; render(); }));
  document.querySelectorAll("[data-task]").forEach((el) => el.addEventListener("change", () => { state.tasks = toggleTask(state.tasks, el.dataset.task, el.checked); state.notice = el.checked ? "Task completed." : "Task reopened."; render(); }));
  document.querySelectorAll("[data-client]").forEach((el) => el.addEventListener("click", () => { state.selectedClientId = el.dataset.client; state.notice = "Client profile opened."; render(); }));
  document.querySelector(".search")?.addEventListener("input", (event) => { state.clientQuery = event.target.value; render(); });
  document.querySelectorAll("[data-setting]").forEach((el) => el.addEventListener("change", () => { state.settings = updateSetting(state.settings, el.dataset.setting, el.checked); state.notice = "Settings updated."; render(); }));
  document.querySelectorAll("[data-notification]").forEach((el) => el.addEventListener("click", () => { state.sentNotifications = { ...state.sentNotifications, [el.dataset.notification]: true }; state.notice = "Notification marked sent."; render(); }));
  document.querySelectorAll("[data-contact]").forEach((el) => el.addEventListener("click", () => { const [channel] = el.dataset.contact.split(":"); state.notice = `${channel === "sms" ? "SMS" : "WhatsApp"} composer opened.`; }));
  document.querySelector(".lead-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    if (data.name.trim()) { state.leads = addLead(state.leads, data); state.notice = "Lead added to pipeline."; }
    render();
  });
  document.querySelector(".profile-editor")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    state.agentProfile = updateAgentProfile(state.agentProfile, data);
    state.profileOpen = false;
    state.notice = "Profile updated.";
    render();
  });
  document.querySelector(".quote-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    state.quoteType = data.type;
    state.quoteSum = Number(data.sum);
    state.quoteResults = compareQuotes(state.quoteType, state.quoteSum); state.notice = "Quote comparison refreshed.";
    render();
  });
}

render();

