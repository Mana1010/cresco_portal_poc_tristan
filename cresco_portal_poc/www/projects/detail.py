import frappe

from cresco_portal_poc.portal.utils import base_context


def _staff_label(staff_name):
	"""'Glenn Frewin' -> 'Glenn Frewin (L3)', matching the POC's display convention."""
	if not staff_name:
		return None
	level = frappe.db.get_value("Staff", staff_name, "level")
	return f"{staff_name} ({level})" if level else staff_name


def get_context(context):
	base_context(context, "projects")

	project_id = frappe.form_dict.get("project_id")
	if not project_id or not frappe.db.exists("Project", project_id):
		frappe.throw(frappe._("Project not found"), frappe.DoesNotExistError)

	doc = frappe.get_doc("Project", project_id)
	context.title = doc.project_name

	payload = {
		"project_code": doc.project_code,
		"project_name": doc.project_name,
		"client": doc.client,
		"project_type": doc.project_type,
		"tier": doc.tier,
		"status": doc.status,
		"fee": doc.fee,
		"project_owner": _staff_label(doc.project_owner),
		"lead": doc.lead,
		"tier_factor": doc.tier_factor,
		"volume_factor": doc.volume_factor,
		"complexity_score": doc.complexity_score,
		"doc_path": doc.doc_path,
		"payment": doc.payment,
		"deliverables": [
			{"deliverable": d.deliverable, "fee": d.fee, "status": d.status} for d in doc.deliverables
		],
		"document_register": [
			{
				"document": d.document,
				"status": d.status,
				"document_date": str(d.document_date) if d.document_date else None,
				"attachment": d.attachment,
			}
			for d in doc.document_register
		],
	}
	context.project_json = frappe.as_json(payload)
