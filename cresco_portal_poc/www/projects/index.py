import frappe

from cresco_portal_poc.portal.utils import base_context


def get_context(context):
	base_context(context, "projects")
	context.title = "Projects"

	projects = frappe.get_all(
		"Project",
		fields=[
			"project_code",
			"project_name",
			"client",
			"project_type",
			"tier",
			"status",
			"fee",
			"project_owner",
		],
		order_by="project_code asc",
	)
	context.projects_json = frappe.as_json(projects)
	context.project_count = len(projects)
