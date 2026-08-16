/**
 * Shared display tokens for the Cresco Portal Core POC portal pages.
 * Mirrors the color/label tables embedded in the original HTML prototype
 * (Cresco_Platform_POC_V3_1_11.html — the `T`, `SC2`, and `PTYPES` consts)
 * so the Frappe-built pages read identically to the POC.
 */
window.CrescoPortal = (function () {
	// Tailwind utility classes for each Tier badge (see tailwind.config.js).
	const TIER_CLASSES = {
		Green: "bg-tier-green-bg text-tier-green-text border-tier-green-border",
		Blue: "bg-tier-blue-bg text-tier-blue-text border-tier-blue-border",
		Amber: "bg-tier-amber-bg text-tier-amber-text border-tier-amber-border",
		Red: "bg-tier-red-bg text-tier-red-text border-tier-red-border",
	};

	// Status-code -> dot color, matches the POC's SC2 table exactly.
	const STATUS_COLORS = {
		"01": "#3B82F6",
		"02": "#8B5CF6",
		"03": "#F59E0B",
		"04": "#F59E0B",
		"05": "#F59E0B",
		"06": "#DC2626",
		"07": "#059669",
		"08": "#059669",
		"09": "#6366F1",
		"10": "#6366F1",
		"11": "#D97706",
		"12": "#D97706",
		"13": "#D97706",
		"14": "#0EA5E9",
		"15": "#0EA5E9",
		"16": "#059669",
		"17": "#059669",
		"18": "#F59E0B",
		"19": "#F59E0B",
		"20": "#059669",
		"21": "#8B5CF6",
		"22": "#059669",
		"23": "#6366F1",
		"24": "#6366F1",
		"25": "#DC2626",
	};

	// Project Type code -> full label, matches the POC's PTYPES table.
	const PTYPE_LABELS = {
		"STR-RESI": "Structural — Residential",
		"STR-COMM": "Structural — Commercial",
		CIVIL: "Civil Engineering",
		ARCH: "Architectural Design",
		MECH: "Mechanical Engineering",
		PMNGT: "Project Management",
		PCSUR: "Point Cloud Survey",
		GRSU: "Grain Storage & Handling",
		FABD: "Fabrication & Detailing",
		PLNG: "Planning",
	};

	function statusCode(status) {
		return (status || "").split(" ")[0];
	}

	function statusColor(status) {
		return STATUS_COLORS[statusCode(status)] || "#6B7280";
	}

	function tierClasses(tier) {
		return TIER_CLASSES[tier] || "bg-slate-100 text-slate-600 border-slate-300";
	}

	function typeLabel(code) {
		return PTYPE_LABELS[code] || code;
	}

	function money(n) {
		if (n === null || n === undefined) return "—";
		return "$" + Number(n).toLocaleString();
	}

	return { TIER_CLASSES, STATUS_COLORS, PTYPE_LABELS, statusCode, statusColor, tierClasses, typeLabel, money };
})();
