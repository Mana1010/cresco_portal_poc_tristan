# Copyright (c) 2026, Tristan and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

# The POC's Org Chart defines "Four Lenses" owned by specific management roles.
# Every other staff member inherits their manager's lens by walking Reports To
# up the hierarchy until one of these roles (or the top, with no lens) is hit.
LENS_BY_POSITION = [
	("Business Manager", "Cost"),
	("Operations Manager", "Time"),
	("Engineering Manager", "Quality"),
	("G&I Manager", "Scale"),
]

MAX_HIERARCHY_DEPTH = 20


def compute_lens(position, reports_to, depth=0):
	"""Resolve a staff member's Lens from their own position, or by climbing
	Reports To until an anchor position (or the top of the tree) is found."""
	if position:
		for needle, lens in LENS_BY_POSITION:
			if needle in position:
				return lens

	if not reports_to or depth >= MAX_HIERARCHY_DEPTH:
		return "None"

	parent = frappe.db.get_value(
		"Staff", reports_to, ["position", "reports_to"], as_dict=True
	)
	if not parent:
		return "None"

	return compute_lens(parent.position, parent.reports_to, depth + 1)


class Staff(Document):
	def validate(self):
		self.lens = compute_lens(self.position, self.reports_to)
