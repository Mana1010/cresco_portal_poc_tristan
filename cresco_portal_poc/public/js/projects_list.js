(function () {
	const { createApp } = Vue;
	const T = window.CrescoPortal;

	createApp({
		data() {
			return {
				projects: window.__PROJECTS__ || [],
				filter: "",
			};
		},
		computed: {
			filtered() {
				const q = this.filter.trim().toLowerCase();
				if (!q) return this.projects;
				return this.projects.filter((p) =>
					[
						p.project_code,
						p.project_name,
						p.client,
						p.project_type,
						p.tier,
						p.status,
						p.project_owner,
					]
						.join(" ")
						.toLowerCase()
						.includes(q)
				);
			},
		},
		methods: {
			openProject(code) {
				window.location.href = "/projects/" + encodeURIComponent(code);
			},
			tierClasses: T.tierClasses,
			statusColor: T.statusColor,
			statusLabel(status) {
				return (status || "").split(" ").slice(1).join(" ");
			},
			statusCode: T.statusCode,
			money: T.money,
		},
		template: `
			<div>
				<h1 class="mb-4 text-xl font-bold text-cresco-navy">Projects ({{ projects.length }})</h1>

				<div class="mb-4 flex items-center gap-3">
					<input
						v-model="filter"
						type="text"
						placeholder="Filter..."
						class="w-72 rounded border border-cresco-bdr px-3 py-1.5 text-sm focus:border-cresco-accent focus:outline-none"
					/>
					<span class="text-xs text-cresco-muted">{{ filtered.length }} records</span>
				</div>

				<div class="overflow-x-auto rounded-lg border border-cresco-bdr bg-white">
					<table class="w-full min-w-[900px] text-sm">
						<thead>
							<tr class="border-b border-cresco-bdr bg-cresco-lightBg text-left text-xs font-semibold text-cresco-muted">
								<th class="px-3 py-2">ID</th>
								<th class="px-3 py-2">Project</th>
								<th class="px-3 py-2">Client</th>
								<th class="px-3 py-2">Type</th>
								<th class="px-3 py-2">Tier</th>
								<th class="px-3 py-2">Status</th>
								<th class="px-3 py-2">Fee</th>
								<th class="px-3 py-2">Owner</th>
							</tr>
						</thead>
						<tbody>
							<tr
								v-for="p in filtered"
								:key="p.project_code"
								class="cursor-pointer border-b border-cresco-bdr last:border-0 hover:bg-cresco-lightBg"
								@click="openProject(p.project_code)"
							>
								<td class="px-3 py-2 text-cresco-muted">{{ p.project_code }}</td>
								<td class="px-3 py-2 font-medium">{{ p.project_name }}</td>
								<td class="px-3 py-2">{{ p.client }}</td>
								<td class="px-3 py-2 text-cresco-muted">{{ p.project_type }}</td>
								<td class="px-3 py-2">
									<span :class="['inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold', tierClasses(p.tier)]">{{ p.tier }}</span>
								</td>
								<td class="px-3 py-2">
									<span class="inline-flex items-center gap-1.5 text-xs font-medium" :style="{ color: statusColor(p.status) }">
										<span class="status-dot" :style="{ backgroundColor: statusColor(p.status) }"></span>
										{{ p.status }}
									</span>
								</td>
								<td class="px-3 py-2">{{ money(p.fee) }}</td>
								<td class="px-3 py-2">{{ p.project_owner }}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		`,
	}).mount("#projects-app");
})();
