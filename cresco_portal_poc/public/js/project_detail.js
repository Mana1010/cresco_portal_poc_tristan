(function () {
	const { createApp } = Vue;
	const T = window.CrescoPortal;

	createApp({
		data() {
			return {
				p: window.__PROJECT__,
				tab: "Overview",
			};
		},
		methods: {
			tierClasses: T.tierClasses,
			statusColor: T.statusColor,
			typeLabel: T.typeLabel,
			money: T.money,
		},
		template: `
			<div>
				<div class="rounded-lg border border-cresco-bdr bg-white p-5">
					<div class="flex items-start justify-between">
						<div>
							<div class="flex items-center gap-2">
								<span class="font-mono text-xs text-cresco-muted">{{ p.project_code }}</span>
								<span :class="['inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold', tierClasses(p.tier)]">{{ p.tier }}</span>
							</div>
							<h1 class="mt-1 text-xl font-bold text-cresco-navy">{{ p.project_name }}</h1>
							<div class="mt-0.5 text-xs text-cresco-muted">{{ p.client }} · {{ typeLabel(p.project_type) }}</div>
						</div>
						<div class="text-right">
							<span class="inline-flex items-center gap-1.5 text-xs font-medium" :style="{ color: statusColor(p.status) }">
								<span class="status-dot" :style="{ backgroundColor: statusColor(p.status) }"></span>
								{{ p.status }}
							</span>
							<div class="mt-1 text-lg font-bold text-cresco-navy">{{ money(p.fee) }}</div>
							<div class="text-[11px] text-cresco-muted">{{ p.deliverables.length }} deliverables</div>
						</div>
					</div>
				</div>

				<div class="mt-4 flex gap-1 border-b border-cresco-bdr">
					<button
						v-for="t in ['Overview', 'Documents']"
						:key="t"
						@click="tab = t"
						:class="[
							'px-3 py-2 text-sm -mb-px border-b-2',
							tab === t ? 'border-cresco-accent text-cresco-accent font-medium' : 'border-transparent text-cresco-muted hover:text-cresco-text',
						]"
					>{{ t }}</button>
				</div>

				<div v-if="tab === 'Overview'" class="mt-4 grid grid-cols-2 gap-4">
					<div class="rounded-lg border border-cresco-bdr bg-white p-4">
						<h3 class="mb-3 text-sm font-semibold text-cresco-navy">Details</h3>
						<dl class="divide-y divide-cresco-bdr text-sm">
							<div class="flex justify-between py-1.5"><dt class="text-cresco-muted">Project Owner</dt><dd class="font-medium">{{ p.project_owner }}</dd></div>
							<div class="flex justify-between py-1.5"><dt class="text-cresco-muted">Lead</dt><dd class="font-medium">{{ p.lead }}</dd></div>
							<div class="flex justify-between py-1.5"><dt class="text-cresco-muted">Type</dt><dd class="font-medium">{{ typeLabel(p.project_type) }}</dd></div>
							<div class="flex justify-between py-1.5"><dt class="text-cresco-muted">Complexity</dt><dd class="font-medium">T{{ p.tier_factor }} × V{{ p.volume_factor }} = {{ p.complexity_score }}</dd></div>
							<div class="flex justify-between py-1.5"><dt class="text-cresco-muted">Tier</dt><dd class="font-medium">{{ p.tier }}</dd></div>
							<div class="flex justify-between py-1.5"><dt class="text-cresco-muted">Fee</dt><dd class="font-medium">{{ money(p.fee) }}</dd></div>
							<div class="flex justify-between py-1.5"><dt class="text-cresco-muted">Doc Path</dt><dd class="font-medium">Path {{ p.doc_path }}</dd></div>
							<div class="flex justify-between py-1.5"><dt class="text-cresco-muted">Payment</dt><dd class="font-medium">{{ p.payment === 'Paid' ? '✓ Paid' : 'Outstanding' }}</dd></div>
						</dl>
					</div>

					<div class="rounded-lg border border-cresco-bdr bg-white p-4">
						<div class="mb-3 flex items-center justify-between">
							<h3 class="text-sm font-semibold text-cresco-navy">Deliverables ({{ p.deliverables.length }})</h3>
						</div>
						<table v-if="p.deliverables.length" class="w-full text-xs">
							<thead>
								<tr class="border-b border-cresco-bdr text-left font-semibold text-cresco-muted">
									<th class="py-1.5 pr-2">#</th>
									<th class="py-1.5 pr-2">Deliverable</th>
									<th class="py-1.5 pr-2">Fee</th>
									<th class="py-1.5 pr-2">Status</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(d, i) in p.deliverables" :key="i" class="border-b border-cresco-bdr last:border-0">
									<td class="py-1.5 pr-2 font-mono text-cresco-muted">D{{ i + 1 }}</td>
									<td class="py-1.5 pr-2 font-medium">{{ d.deliverable }}</td>
									<td class="py-1.5 pr-2">{{ money(d.fee) }}</td>
									<td class="py-1.5 pr-2">
										<span class="inline-flex items-center gap-1.5" :style="{ color: statusColor(d.status) }">
											<span class="status-dot" :style="{ backgroundColor: statusColor(d.status) }"></span>
											{{ d.status }}
										</span>
									</td>
								</tr>
							</tbody>
						</table>
						<div v-else class="py-4 text-center text-xs text-cresco-muted">No deliverables seeded for this project</div>
					</div>
				</div>

				<div v-if="tab === 'Documents'" class="mt-4 rounded-lg border border-cresco-bdr bg-white p-4">
					<div class="mb-3 flex items-center justify-between">
						<div>
							<h3 class="text-sm font-semibold text-cresco-navy">Document Register</h3>
							<div class="text-xs text-cresco-muted">Path {{ p.doc_path }} — Persistent attribute. Locks at Status 02.</div>
						</div>
						<span class="rounded bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-cresco-danger">LOCKED</span>
					</div>
					<table class="w-full text-sm">
						<thead>
							<tr class="border-b border-cresco-bdr text-left text-xs font-semibold text-cresco-muted">
								<th class="py-1.5 pr-2">Document</th>
								<th class="py-1.5 pr-2">Status</th>
								<th class="py-1.5 pr-2">Date</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(d, i) in p.document_register" :key="i" class="border-b border-cresco-bdr last:border-0">
								<td class="py-1.5 pr-2">{{ d.document }}</td>
								<td class="py-1.5 pr-2">
									<span v-if="d.status === 'Submitted'" class="text-cresco-success">✓</span>
									<span v-else class="text-cresco-warn">Pending</span>
								</td>
								<td class="py-1.5 pr-2 text-cresco-muted">{{ d.document_date || '—' }}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		`,
	}).mount("#project-detail-app");
})();
