/** Tailwind config for the Cresco Portal Core POC (v0.1.0) portal pages.
 * Color tokens are lifted directly from the original HTML prototype
 * (Cresco_Platform_POC_V3_1_11.html — the `B` and `T` constants) so the
 * Frappe-built pages match it pixel-for-pixel. */
module.exports = {
	content: [
		"./cresco_portal_poc/www/**/*.html",
		"./cresco_portal_poc/templates/**/*.html",
		"./cresco_portal_poc/public/js/**/*.js",
	],
	theme: {
		extend: {
			colors: {
				cresco: {
					navy: "#0B1220",
					accent: "#0EA5E9",
					bg: "#F6F7FB",
					success: "#059669",
					warn: "#D97706",
					danger: "#DC2626",
					blue: "#2563EB",
					text: "#1E293B",
					muted: "#64748B",
					bdr: "#E2E8F0",
					lightBg: "#F1F5F9",
					cyan: "#0891B2",
					violet: "#6366F1",
				},
				tier: {
					green: { bg: "#ECFDF5", text: "#059669", border: "#A7F3D0" },
					blue: { bg: "#EFF6FF", text: "#2563EB", border: "#93C5FD" },
					amber: { bg: "#FFFBEB", text: "#D97706", border: "#FCD34D" },
					red: { bg: "#FEF2F2", text: "#DC2626", border: "#FCA5A5" },
				},
			},
		},
	},
	plugins: [],
};
