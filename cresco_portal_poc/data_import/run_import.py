"""
One-off import for Cresco Portal Core POC v0.1.0.

Reads data_import/import_data.json (produced by extract_poc_data.js from the
POC HTML) and creates Client, Staff, Project (+ child tables), and Risk
Register records. Idempotent — safe to re-run; existing records are skipped.

Run with:
    bench --site <site> execute cresco_portal_poc.data_import.run_import.execute
"""

import json
import os
import random

import frappe

random.seed(2026)  # deterministic Payment placeholder values across re-runs

# Frappe's Cresco Portal User role, granted read-only access to the doctypes
# used by the portal pages (see the doctype JSON permissions).
PORTAL_ROLE = "Cresco Portal User"


def _data_path():
	module_dir = frappe.get_app_path("cresco_portal_poc")
	return os.path.normpath(os.path.join(module_dir, "data_import", "import_data.json"))


def _load_data():
	with open(_data_path(), encoding="utf-8") as f:
		return json.load(f)


def _slugify_email(staff_name):
	base = "".join(c.lower() if c.isalnum() else "." for c in staff_name)
	while ".." in base:
		base = base.replace("..", ".")
	base = base.strip(".")
	return f"{base}@cresco-poc.demo"


def import_clients(clients):
	created = 0
	for client_name in clients:
		if frappe.db.exists("Client", client_name):
			continue
		frappe.get_doc({"doctype": "Client", "client_name": client_name}).insert()
		created += 1
	print(f"Clients: {created} created, {len(clients) - created} already existed.")


def import_staff(staff_rows):
	created = 0
	for row in staff_rows:
		if frappe.db.exists("Staff", row["staff_name"]):
			continue

		doc = frappe.get_doc(
			{
				"doctype": "Staff",
				"staff_name": row["staff_name"],
				"position": row["position"],
				"level": row["level"],
				"reports_to": row["reports_to"],
			}
		)
		doc.insert()
		created += 1

		# Link (and create, if needed) a real Frappe User for portal login.
		email = _slugify_email(row["staff_name"])
		if not frappe.db.exists("User", email):
			user = frappe.get_doc(
				{
					"doctype": "User",
					"email": email,
					"first_name": row["staff_name"],
					"user_type": "Website User",
					"send_welcome_email": 0,
					"roles": [{"role": PORTAL_ROLE}],
				}
			)
			user.insert(ignore_permissions=True)
			user.new_password = "cresco-poc-2026"
			user.save(ignore_permissions=True)

		frappe.db.set_value("Staff", doc.name, "user", email)

	print(f"Staff: {created} created, {len(staff_rows) - created} already existed.")


def import_projects(projects):
	created = 0
	for p in projects:
		if frappe.db.exists("Project", p["project_code"]):
			continue

		doc = frappe.get_doc(
			{
				"doctype": "Project",
				"project_code": p["project_code"],
				"project_name": p["project_name"],
				"client": p["client"],
				"project_type": p["project_type"],
				"status": p["status"],
				"fee": p["fee"],
				"project_owner": p["project_owner"],
				"lead": p["lead"],
				"tier_factor": p["tier_factor"],
				"volume_factor": p["volume_factor"],
				"doc_path": str(p["doc_path"]),
				"project_date": p["project_date"],
				"payment": random.choice(["Paid", "Outstanding"]),
				"deliverables": p["deliverables"],
				"document_register": p["document_register"],
				"transmittals": p["transmittals"],
			}
		)
		doc.insert()
		created += 1
	print(f"Projects: {created} created, {len(projects) - created} already existed.")


def import_risk_register(rows):
	created = 0
	for row in rows:
		if frappe.db.exists("Risk Register", row["risk"]):
			continue
		frappe.get_doc({"doctype": "Risk Register", **row}).insert()
		created += 1
	print(f"Risk Register: {created} created, {len(rows) - created} already existed.")


def execute():
	frappe.set_user("Administrator")
	data = _load_data()

	import_clients(data["clients"])
	import_staff(data["staff"])
	import_projects(data["projects"])
	import_risk_register(data["risk_register"])

	frappe.db.commit()
	print("Import complete.")
