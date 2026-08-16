import frappe

from cresco_portal_poc.portal.utils import base_context


def get_context(context):
	base_context(context, "risk-register")
	context.title = "Risk Register"

	risks = frappe.get_all(
		"Risk Register",
		fields=["risk", "likelihood", "impact", "mitigation"],
		order_by="creation asc",
	)
	context.risks_json = frappe.as_json(risks)
