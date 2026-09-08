export const appRoutes = ["dashboard", "leads", "pipeline", "renewals", "clients", "quotes", "commissions", "notifications", "tasks", "reports", "settings"];

export function normalizeRoute(route) {
  return appRoutes.includes(route) ? route : "dashboard";
}

export function routeFromUrl(url) {
  const parsed = new URL(url, "https://bizyako.local");
  return normalizeRoute(parsed.searchParams.get("view") || "dashboard");
}

export const TODAY = new Date(2026, 8, 6);

export const insurers = [
  { name: "Jubilee", motor: 0.062, medical: 0.081, life: 0.045, commission: 0.125 },
  { name: "Britam", motor: 0.058, medical: 0.078, life: 0.05, commission: 0.15 },
  { name: "CIC", motor: 0.065, medical: 0.075, life: 0.042, commission: 0.1 },
  { name: "APA", motor: 0.06, medical: 0.084, life: 0.048, commission: 0.175 },
  { name: "Madison", motor: 0.057, medical: 0.079, life: 0.055, commission: 0.2 },
];

export const pipelineStages = ["New", "Follow Up", "Quotation", "Negotiation", "Won"];

export const seedClients = [
  {
    id: "c1",
    name: "Grace Wanjiru",
    phone: "0722 118 402",
    dependents: ["Kevin Wanjiru (son, 9)", "Faith Wanjiru (daughter, 6)"],
    claims: [{ date: "2026-03-14", type: "Motor - windscreen", status: "Settled" }],
    policies: [
      { id: "p1", type: "Motor", insurer: "CIC", sumInsured: 1800000, premium: 117000, inception: "2025-09-10", nextRenewal: "2026-09-10" },
      { id: "p9", type: "Life", insurer: "Britam", sumInsured: 1000000, premium: 50000, inception: "2025-08-30", nextRenewal: "2026-08-30" },
    ],
  },
  {
    id: "c2",
    name: "Peter Otieno",
    phone: "0733 902 217",
    dependents: [],
    claims: [],
    policies: [
      { id: "p2", type: "Medical", insurer: "Jubilee", sumInsured: 2000000, premium: 162000, inception: "2025-09-13", nextRenewal: "2026-09-13" },
    ],
  },
  {
    id: "c3",
    name: "Amina Hassan",
    phone: "0711 554 903",
    dependents: ["Yusuf Hassan (son, 14)"],
    claims: [{ date: "2025-11-02", type: "Medical - inpatient", status: "Paid" }],
    policies: [
      { id: "p3", type: "Medical", insurer: "APA", sumInsured: 3000000, premium: 252000, inception: "2025-09-19", nextRenewal: "2026-09-19" },
    ],
  },
  {
    id: "c4",
    name: "Samuel Kiptoo",
    phone: "0700 441 320",
    dependents: [],
    claims: [],
    policies: [
      { id: "p4", type: "Life", insurer: "Madison", sumInsured: 5000000, premium: 275000, inception: "2025-08-27", nextRenewal: "2026-08-27" },
    ],
  },
  {
    id: "c5",
    name: "Lucy Nyambura",
    phone: "0745 220 018",
    dependents: ["Brian Nyambura (son, 4)"],
    claims: [],
    policies: [
      { id: "p5", type: "Motor", insurer: "Britam", sumInsured: 1200000, premium: 69600, inception: "2025-10-05", nextRenewal: "2026-10-05" },
      { id: "p10", type: "Medical", insurer: "Madison", sumInsured: 1800000, premium: 142200, inception: "2025-09-09", nextRenewal: "2026-09-09" },
    ],
  },
  {
    id: "c6",
    name: "David Mwangi",
    phone: "0788 663 512",
    dependents: [],
    claims: [{ date: "2026-01-20", type: "Motor - theft", status: "Under review" }],
    policies: [
      { id: "p6", type: "Motor", insurer: "APA", sumInsured: 2200000, premium: 132000, inception: "2025-10-21", nextRenewal: "2026-10-21" },
    ],
  },
  {
    id: "c7",
    name: "Esther Chebet",
    phone: "0712 887 044",
    dependents: ["Nancy Chebet (daughter, 11)", "James Chebet (son, 8)"],
    claims: [],
    policies: [
      { id: "p7", type: "Medical", insurer: "CIC", sumInsured: 1500000, premium: 112500, inception: "2025-12-01", nextRenewal: "2026-12-01" },
    ],
  },
  {
    id: "c8",
    name: "Joseph Karanja",
    phone: "0721 330 887",
    dependents: [],
    claims: [],
    policies: [
      { id: "p8", type: "Life", insurer: "Jubilee", sumInsured: 3500000, premium: 157500, inception: "2026-07-15", nextRenewal: "2027-06-06" },
    ],
  },
];

export const seedEmployees = [
  { id: "e1", name: "Peter Agent", role: "Admin", target: 600000 },
  { id: "e2", name: "Mary Wambui", role: "User", target: 420000 },
  { id: "e3", name: "Brian Otieno", role: "User", target: 360000 },
];
export const seedLeads = [
  { id: "l1", name: "Peter Mwangi", product: "Motor Insurance - Private Car", value: 85000, source: "WhatsApp", stage: "New", lastContact: "10:31 AM", assignedTo: "e1" },
  { id: "l2", name: "Jane Njeri", product: "Medical Insurance", value: 168000, source: "Referral", stage: "New", lastContact: "2 days ago", assignedTo: "e2" },
  { id: "l3", name: "Kevin Omondi", product: "Motor Insurance", value: 61000, source: "Website", stage: "Follow Up", lastContact: "Yesterday", assignedTo: "e1" },
  { id: "l4", name: "Daniel Otieno", product: "Life Insurance", value: 220000, source: "Call", stage: "Follow Up", lastContact: "1 day ago", assignedTo: "e3" },
  { id: "l5", name: "Winnie Adhiambo", product: "Motor cover", value: 94000, source: "WhatsApp", stage: "Quotation", lastContact: "Today", assignedTo: "e2" },
  { id: "l6", name: "Caroline Wafula", product: "Life cover", value: 180000, source: "Referral", stage: "Won", lastContact: "Today", assignedTo: "e1" },
];

export const fmtKES = (n) => "KES " + Math.round(n).toLocaleString("en-KE");

export const fmtDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export function daysBetween(dateStr, today = TODAY) {
  return Math.round((new Date(dateStr) - today) / 86400000);
}

export function buildRenewalRows(clients, today = TODAY) {
  return clients
    .flatMap((client) =>
      client.policies.map((policy) => ({
        clientId: client.id,
        clientName: client.name,
        phone: client.phone,
        ...policy,
        daysLeft: daysBetween(policy.nextRenewal, today),
      })),
    )
    .sort((a, b) => a.daysLeft - b.daysLeft);
}

export function buildCommissionLedger(clients) {
  return clients.flatMap((client) =>
    client.policies.map((policy) => {
      const insurer = insurers.find((item) => item.name === policy.insurer);
      const rate = insurer?.commission ?? 0.12;
      const expected = policy.premium * rate;
      const daysSinceInception = -daysBetween(policy.inception);
      const paid = daysSinceInception > 75 ? expected : 0;
      const status = daysSinceInception > 75 ? "Paid" : daysSinceInception > 45 ? "Overdue" : "Pending";

      return {
        id: `cm-${policy.id}`,
        clientName: client.name,
        policyType: policy.type,
        insurer: policy.insurer,
        premium: policy.premium,
        rate,
        expected,
        paid,
        status,
      };
    }),
  );
}

export function compareQuotes(type, sumInsured) {
  const rows = insurers
    .map((insurer) => {
      const premium = Math.round((sumInsured * insurer[type] + 1500) / 10) * 10;
      return {
        insurer: insurer.name,
        premium,
        commission: premium * insurer.commission,
        badges: [],
      };
    })
    .sort((a, b) => a.premium - b.premium);

  const bestCommission = [...rows].sort((a, b) => b.commission - a.commission)[0]?.insurer;
  return rows.map((row, index) => ({
    ...row,
    badges: [
      ...(index === 0 ? ["Lowest premium"] : []),
      ...(row.insurer === bestCommission ? ["Best commission"] : []),
    ],
  }));
}

export function moveLeadStage(leads, id, direction) {
  return leads.map((lead) => {
    if (lead.id !== id) return lead;
    const currentIndex = pipelineStages.indexOf(lead.stage);
    const nextIndex = Math.min(pipelineStages.length - 1, Math.max(0, currentIndex + direction));
    return { ...lead, stage: pipelineStages[nextIndex] };
  });
}

export function addLead(leads, lead) {
  const maxId = leads.reduce((max, item) => Math.max(max, Number(item.id.replace(/\D/g, "")) || 0), 0);
  return [
    ...leads,
    {
      id: `l${maxId + 1}`,
      name: lead.name.trim(),
      product: lead.product?.trim() || "Not specified",
      value: Number(lead.value) || 0,
      source: lead.source?.trim() || "Manual",
      stage: "New",
      lastContact: "Just now",
    },
  ];
}

export function buildDashboardMetrics(clients, leads, ledger) {
  const renewalRows = buildRenewalRows(clients);
  const upcomingRenewals = renewalRows.filter((row) => row.daysLeft >= 0 && row.daysLeft <= 30);
  const policies = clients.flatMap((client) => client.policies);
  return {
    newLeads: leads.filter((lead) => lead.stage === "New").length,
    followUps: leads.filter((lead) => lead.stage === "Follow Up").length,
    quotesSent: leads.filter((lead) => lead.stage === "Quotation").length + 1,
    policiesSold: leads.filter((lead) => lead.stage === "Won").length + 1,
    renewals: upcomingRenewals.length,
    clients: clients.length,
    totalLeads: leads.length,
    policyCount: policies.length,
    premiumAtRisk: upcomingRenewals.reduce((sum, row) => sum + row.premium, 0),
    pipelineValue: leads.filter((lead) => lead.stage !== "Won").reduce((sum, lead) => sum + lead.value, 0),
    outstandingCommission: ledger.reduce((sum, row) => sum + row.expected - row.paid, 0),
  };
}


export function markReminderSent(reminders, policyId, channel) {
  return { ...reminders, [`${policyId}:${channel}`]: true };
}

export function markCommissionPaid(ledger, id) {
  return ledger.map((row) => (row.id === id ? { ...row, status: "Paid", paid: row.expected } : row));
}

export function toggleTask(tasks, id, done) {
  return tasks.map((task) => (task.id === id ? { ...task, done } : task));
}

export function updateSetting(settings, key, value) {
  return { ...settings, [key]: value };
}
export function normalizeKenyanPhone(phone) {
  const digits = String(phone).replace(/\D/g, "");
  if (digits.startsWith("254")) return `+${digits}`;
  if (digits.startsWith("0")) return `+254${digits.slice(1)}`;
  return `+${digits}`;
}

export function buildContactLinks(client, message = "") {
  const phoneE164 = normalizeKenyanPhone(client.phone);
  const phoneDigits = phoneE164.replace(/\D/g, "");
  const encoded = encodeURIComponent(message);
  return {
    phoneE164,
    whatsappUrl: `https://wa.me/${phoneDigits}${encoded ? `?text=${encoded}` : ""}`,
    smsUrl: `sms:${phoneE164}${encoded ? `?body=${encoded}` : ""}`,
  };
}

export function buildNotificationQueue({ clients, leads, ledger }, today = TODAY) {
  const policyNotifications = buildRenewalRows(clients, today)
    .filter((policy) => policy.daysLeft <= 30)
    .map((policy) => ({
      id: policy.daysLeft < 0 ? `expired-${policy.id}` : `renewal-${policy.id}`,
      type: policy.daysLeft < 0 ? "policy_expired" : "policy_renewal",
      title: policy.daysLeft < 0 ? `${policy.clientName} policy expired` : `${policy.clientName} renewal due`,
      detail: `${policy.type} policy with ${policy.insurer} ${policy.daysLeft < 0 ? `expired ${Math.abs(policy.daysLeft)} days ago` : `renews in ${policy.daysLeft} days`}.`,
      urgency: policy.daysLeft < 0 ? "high" : policy.daysLeft <= 7 ? "high" : "medium",
      relevantParties: ["Agent", "Client", policy.insurer],
      clientId: policy.clientId,
      policyId: policy.id,
    }));

  const referralNotifications = leads
    .filter((lead) => lead.source === "Referral" && lead.stage !== "Won")
    .map((lead) => ({
      id: `referral-${lead.id}`,
      type: "referral_follow_up",
      title: `${lead.name} referral needs follow-up`,
      detail: `${lead.product} lead is still in ${lead.stage}.`,
      urgency: "medium",
      relevantParties: ["Agent", "Referral partner", lead.name],
      leadId: lead.id,
    }));

  const commissionNotifications = ledger
    .filter((row) => row.status === "Overdue")
    .map((row) => ({
      id: `commission-${row.id}`,
      type: "commission_overdue",
      title: `${row.insurer} commission overdue`,
      detail: `${row.clientName} ${row.policyType} commission of ${fmtKES(row.expected)} is unpaid.`,
      urgency: "medium",
      relevantParties: ["Agent", row.insurer],
      commissionId: row.id,
    }));

  return [...policyNotifications, ...referralNotifications, ...commissionNotifications].sort((a, b) => {
    const rank = { high: 0, medium: 1, low: 2 };
    return rank[a.urgency] - rank[b.urgency] || a.title.localeCompare(b.title);
  });
}
export function renewalStatus(daysLeft) {
  if (daysLeft < 0) return { label: `${Math.abs(daysLeft)}d overdue`, tone: "danger" };
  if (daysLeft <= 7) return { label: `${daysLeft} days`, tone: "danger" };
  if (daysLeft <= 30) return { label: `${daysLeft} days`, tone: "warn" };
  return { label: `${daysLeft} days`, tone: "ok" };
}

export function buildEmployeeReports(employees, leads, ledger) {
  return employees.map((employee) => {
    const assignedLeads = leads.filter((lead) => lead.assignedTo === employee.id);
    const wonLeads = assignedLeads.filter((lead) => lead.stage === "Won");
    const pipelineValue = assignedLeads.filter((lead) => lead.stage !== "Won").reduce((sum, lead) => sum + lead.value, 0);
    const commissionDue = ledger.filter((_, index) => index % employees.length === employees.findIndex((item) => item.id === employee.id)).reduce((sum, row) => sum + row.expected - row.paid, 0);
    return {
      id: employee.id,
      name: employee.name,
      role: employee.role,
      assignedLeads: assignedLeads.length,
      wonPolicies: wonLeads.length,
      pipelineValue,
      commissionDue,
      targetProgress: Math.min(100, Math.round((pipelineValue / employee.target) * 100)),
    };
  });
}

export function updateAgentProfile(profile, changes) {
  const role = changes.role === "Admin" ? "Admin" : "User";
  return {
    ...profile,
    name: changes.name?.trim() || profile.name,
    role,
  };
}