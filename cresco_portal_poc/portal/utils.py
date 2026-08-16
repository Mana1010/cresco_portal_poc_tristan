"""Shared helpers for the v0.1.0 portal pages (Projects, Project Detail,
Risk Register). All three pages require a logged-in Staff-linked user and
show every authenticated user the same data (see Q17/Q18 in
requirements/planning/v0.1.0-open-questions.md — no per-owner filtering,
no anonymous/public access)."""

import frappe


def require_login():
	"""Redirect Guests to login, returning to the page they asked for."""
	if frappe.session.user == "Guest":
		frappe.local.flags.redirect_location = "/login?redirect-to=" + frappe.request.path
		raise frappe.Redirect


def _initials(staff_name):
	parts = [p for p in staff_name.split() if p]
	letters = (parts[0][0] if parts else "") + (parts[-1][0] if len(parts) > 1 else "")
	return letters.upper()


def get_current_staff():
	"""The Staff record linked to the logged-in user, or None if the user
	isn't linked to one (e.g. Administrator)."""
	staff_name = frappe.db.get_value("Staff", {"user": frappe.session.user}, "name")
	if not staff_name:
		return None
	doc = frappe.get_doc("Staff", staff_name)
	return {
		"staff_name": doc.staff_name,
		"level": doc.level,
		"initials": _initials(doc.staff_name),
	}


def get_projects_count():
	return frappe.db.count("Project")


def base_context(context, active_page):
	"""Common context every portal page needs: forces the minimal base
	template (no default Frappe navbar/breadcrumbs/container), and fills in
	the shared sidebar/topbar data."""
	require_login()
	context.base_template_path = "templates/base.html"
	context.no_cache = 1
	context.active_page = active_page
	context.project_count = get_projects_count()
	context.current_staff = get_current_staff()
	return context
