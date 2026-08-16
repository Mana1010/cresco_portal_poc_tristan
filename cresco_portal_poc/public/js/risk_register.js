(function () {
	const { createApp } = Vue;

	const IMPACT_CLASSES = {
		High: "bg-cresco-danger text-white",
		Medium: "bg-cresco-warn text-white",
		Low: "bg-cresco-success text-white",
	};

	createApp({
		data() {
			return {
				risks: window.__RISKS__ || [],
			};
		},
		methods: {
			impactClasses(impact) {
				return IMPACT_CLASSES[impact] || "bg-slate-400 text-white";
			},
		},
		template: `
			<div>
				<h1 class="text-xl font-bold text-cresco-navy">Risk Register</h1>
				<p class="mb-4 text-xs text-cresco-muted">Brief v1.3 §17.</p>

				<div class="overflow-x-auto rounded-lg border border-cresco-bdr bg-white">
					<table class="w-full min-w-[700px] text-sm">
						<thead>
							<tr class="border-b border-cresco-bdr bg-cresco-lightBg text-left text-xs font-semibold text-cresco-muted">
								<th class="px-3 py-2">Risk</th>
								<th class="px-3 py-2">Likelihood</th>
								<th class="px-3 py-2">Impact</th>
								<th class="px-3 py-2">Mitigation</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="r in risks" :key="r.risk" class="border-b border-cresco-bdr last:border-0">
								<td class="px-3 py-2 font-medium">{{ r.risk }}</td>
								<td class="px-3 py-2">{{ r.likelihood }}</td>
								<td class="px-3 py-2">
									<span :class="['inline-block rounded px-2 py-0.5 text-[10px] font-bold', impactClasses(r.impact)]">{{ r.impact.toUpperCase() }}</span>
								</td>
								<td class="px-3 py-2 text-cresco-muted">{{ r.mitigation }}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		`,
	}).mount("#risk-register-app");
})();
