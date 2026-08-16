#!/usr/bin/env node
/*
 * One-off extraction/transform script for Cresco Portal Core POC v0.1.0.
 *
 * Pulls the data + generation logic embedded in
 * requirements/Cresco_Platform_POC_V3_1_11.html (the MP project array, the
 * ORG staff hierarchy, RISKS_V13, DOCS/DEL_TEMPLATES templates, and the
 * status lookup ST) and reproduces the POC's own seeding algorithms
 * (seedExistingDeliverables, the Document Register submitted/pending split,
 * the two static Transmittal rows) to produce clean, import-ready JSON.
 *
 * Run with: node extract_poc_data.js > import_data.json
 */

const fs = require("fs");
const path = require("path");

const HTML_PATH = path.join(
	__dirname,
	"..",
	"..",
	"requirements",
	"Cresco_Platform_POC_V3_1_11.html"
);

const html = fs.readFileSync(HTML_PATH, "utf8");

/** Extract the balanced [...] or {...} literal that follows `const NAME=`. */
function extractBalanced(src, marker) {
	const markerIdx = src.indexOf(marker);
	if (markerIdx === -1) throw new Error("marker not found: " + marker);
	let i = markerIdx + marker.length;
	while (/\s/.test(src[i])) i++;
	const openChar = src[i];
	const closeChar = openChar === "[" ? "]" : "}";
	let depth = 0;
	let inStr = false;
	let strChar = "";
	let j = i;
	for (; j < src.length; j++) {
		const c = src[j];
		if (inStr) {
			if (c === "\\") {
				j++;
				continue;
			}
			if (c === strChar) inStr = false;
			continue;
		}
		if (c === '"' || c === "'" || c === "`") {
			inStr = true;
			strChar = c;
			continue;
		}
		if (c === openChar) depth++;
		else if (c === closeChar) {
			depth--;
			if (depth === 0) {
				j++;
				break;
			}
		}
	}
	return src.slice(i, j);
}

// MP uses quoted keys throughout -> valid JSON directly.
const MP = JSON.parse(extractBalanced(html, "const MP="));

// These use unquoted JS object-literal keys -> evaluate as JS.
const ORG = eval("(" + extractBalanced(html, "const ORG=") + ")");
const RISKS_V13 = eval(extractBalanced(html, "const RISKS_V13="));
const DOCS = eval("(" + extractBalanced(html, "const DOCS=") + ")");
const DEL_TEMPLATES = eval("(" + extractBalanced(html, "const DEL_TEMPLATES=") + ")");
const ST = eval("(" + extractBalanced(html, "const ST=") + ")");
const PTYPES = eval(extractBalanced(html, "const PTYPES="));

// ---------------------------------------------------------------------------
// Staff: flatten the ORG hierarchy tree into a flat list with Reports To.
// ---------------------------------------------------------------------------
const staff = [];
function walkOrg(node, parentName) {
	staff.push({
		staff_name: node.name,
		position: node.title,
		level: "L" + node.level,
		reports_to: parentName || null,
	});
	(node.children || []).forEach((child) => walkOrg(child, node.name));
}
walkOrg(ORG, null);

// ---------------------------------------------------------------------------
// Clients: distinct client display strings from MP, in first-seen order.
// ---------------------------------------------------------------------------
const seenClients = new Set();
const clients = [];
for (const p of MP) {
	if (!seenClients.has(p.cl)) {
		seenClients.add(p.cl);
		clients.push(p.cl);
	}
}

// ---------------------------------------------------------------------------
// Risk Register
// ---------------------------------------------------------------------------
const riskRegister = RISKS_V13.map((r) => ({
	risk: r.r,
	likelihood: r.l,
	impact: r.i,
	mitigation: r.m,
}));

// ---------------------------------------------------------------------------
// Per-project Deliverables — reproduces seedExistingDeliverables() (minus the
// QA chain, which is out of scope for v0.1.0).
// ---------------------------------------------------------------------------
function seedDeliverables(p) {
	const template = (DEL_TEMPLATES[p.ty] || DEL_TEMPLATES["STR-RESI"]).slice();
	const baseSum = template.reduce((s, i) => s + i.base, 0);
	const scale = baseSum > 0 ? p.fe / baseSum : 1;
	const anchor = parseInt(p.st) || 2;

	return template.map((item, i) => {
		let n = Math.max(1, Math.min(25, anchor + (i - Math.floor(template.length / 2))));
		if (p.st === "06" && i === 0) n = 6;
		if (p.st === "25" && i === 0) n = 25;
		const code = String(n).padStart(2, "0");
		const validCode = ST[code] ? code : "02";
		return {
			deliverable: item.n,
			fee: Math.round(item.base * scale),
			status: `${validCode} ${ST[validCode]}`,
		};
	});
}

// ---------------------------------------------------------------------------
// Per-project Document Register — reproduces the Documents tab render logic:
// `sub = i < docs.length - (dp === 1 ? 0 : 2)`, dates 2026-01-(10+i).
// ---------------------------------------------------------------------------
function seedDocumentRegister(p) {
	const docs = DOCS[p.ty] || DOCS["STR-RESI"];
	return docs.map((docName, i) => {
		const submitted = i < docs.length - (p.dp === 1 ? 0 : 2);
		return {
			document: docName,
			status: submitted ? "Submitted" : "Pending",
			document_date: `2026-01-${String(10 + i).padStart(2, "0")}`,
		};
	});
}

// ---------------------------------------------------------------------------
// Per-project Transmittals — the POC renders the same 2 static rows for every
// project (see Transmittals tab render), just substituting the project ID.
// ---------------------------------------------------------------------------
function seedTransmittals(p) {
	return [
		{
			transmittal_id: `${p.id}-TX-001`,
			purpose: "IFC",
			transmittal_date: "2026-02-15",
			status: "Issued",
		},
		{
			transmittal_id: `${p.id}-TX-002`,
			purpose: "Client Review",
			transmittal_date: "2026-02-28",
			status: "Issued",
		},
	];
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------
const projects = MP.map((p) => ({
	project_code: p.id,
	project_name: p.n,
	client: p.cl,
	project_type: p.ty,
	status: `${p.st} ${ST[p.st]}`,
	fee: p.fe,
	project_owner: p.po,
	lead: p.le,
	tier_factor: p.te,
	volume_factor: p.vo,
	doc_path: p.dp,
	project_date: p.da,
	// Not driven by any real field in the POC's own project data (see
	// v0.1.0-open-questions.md Q7) — placeholder, randomised at import time.
	payment: null,
	deliverables: seedDeliverables(p),
	document_register: seedDocumentRegister(p),
	transmittals: seedTransmittals(p),
}));

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------
const output = { clients, staff, projects, risk_register: riskRegister };
console.log(JSON.stringify(output, null, 2));

// Extraction summary to stderr so it doesn't pollute the JSON on stdout.
console.error(
	`Extracted: ${clients.length} clients, ${staff.length} staff, ` +
		`${projects.length} projects, ${riskRegister.length} risk register rows.`
);
