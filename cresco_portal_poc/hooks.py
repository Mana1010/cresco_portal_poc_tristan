app_name = "cresco_portal_poc"
app_title = "Cresco Portal POC"
app_publisher = "Tristan"
app_description = "Cresco Portal Core POC (v0.1.0)"
app_email = "tristan@servio.ph"
app_license = "mit"

# Apps
# ------------------

# required_apps = []

# Each item in the list will be shown as an app in the apps page
# add_to_apps_screen = [
# 	{
# 		"name": "cresco_portal_poc",
# 		"logo": "/assets/cresco_portal_poc/logo.png",
# 		"title": "Cresco Portal POC",
# 		"route": "/cresco_portal_poc",
# 		"has_permission": "cresco_portal_poc.api.permission.has_app_permission"
# 	}
# ]

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/cresco_portal_poc/css/cresco_portal_poc.css"
# app_include_js = "/assets/cresco_portal_poc/js/cresco_portal_poc.js"

# include js, css files in header of web template
web_include_css = ["/assets/cresco_portal_poc/css/portal.css"]
# NOTE: Vue + portal_tokens.js are deliberately NOT included here. Frappe's
# base.html injects web_include_js scripts *after* the {% block content %}
# body, so a page's own mount script (which also lives in content) would run
# before Vue was defined. Each portal page includes them explicitly, in
# order, right before its own mount script instead.

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "cresco_portal_poc/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Svg Icons
# ------------------
# include app icons in desk
# app_include_icons = "cresco_portal_poc/public/icons.svg"

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# Sends Cresco Portal User logins straight to the Projects list instead of
# Frappe's default post-login landing (which otherwise tries /desk first,
# 403s since these are desk_access=0 Website Users, then falls back to /me).
role_home_page = {
	"Cresco Portal User": "projects",
}

# Website route rules
# --------------------
# /projects/<project_id> is a dynamic detail route mapped to a single
# www/projects/detail.py + detail.html pair. /risk-register keeps its
# friendly hyphenated URL while the underlying file is risk_register.py/.html
# (Python can't import a hyphenated module name).

website_route_rules = [
	{"from_route": "/projects/<project_id>", "to_route": "projects/detail"},
	{"from_route": "/risk-register", "to_route": "risk_register"},
]

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# automatically load and sync documents of this doctype from downstream apps
# importable_doctypes = [doctype_1]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
# 	"methods": "cresco_portal_poc.utils.jinja_methods",
# 	"filters": "cresco_portal_poc.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "cresco_portal_poc.install.before_install"
# after_install = "cresco_portal_poc.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "cresco_portal_poc.uninstall.before_uninstall"
# after_uninstall = "cresco_portal_poc.uninstall.after_uninstall"

# Integration Setup
# ------------------
# To set up dependencies/integrations with other apps
# Name of the app being installed is passed as an argument

# before_app_install = "cresco_portal_poc.utils.before_app_install"
# after_app_install = "cresco_portal_poc.utils.after_app_install"

# Integration Cleanup
# -------------------
# To clean up dependencies/integrations with other apps
# Name of the app being uninstalled is passed as an argument

# before_app_uninstall = "cresco_portal_poc.utils.before_app_uninstall"
# after_app_uninstall = "cresco_portal_poc.utils.after_app_uninstall"

# Build
# ------------------
# To hook into the build process

# after_build = "cresco_portal_poc.build.after_build"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "cresco_portal_poc.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
# 	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"cresco_portal_poc.tasks.all"
# 	],
# 	"daily": [
# 		"cresco_portal_poc.tasks.daily"
# 	],
# 	"hourly": [
# 		"cresco_portal_poc.tasks.hourly"
# 	],
# 	"weekly": [
# 		"cresco_portal_poc.tasks.weekly"
# 	],
# 	"monthly": [
# 		"cresco_portal_poc.tasks.monthly"
# 	],
# }

# Testing
# -------

# before_tests = "cresco_portal_poc.install.before_tests"

# Extend DocType Class
# ------------------------------
#
# Specify custom mixins to extend the standard doctype controller.
# extend_doctype_class = {
# 	"Task": "cresco_portal_poc.custom.task.CustomTaskMixin"
# }

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "cresco_portal_poc.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "cresco_portal_poc.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# -----------------------------------------------------------

# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------
# before_request = ["cresco_portal_poc.utils.before_request"]
# after_request = ["cresco_portal_poc.utils.after_request"]

# Job Events
# ----------
# before_job = ["cresco_portal_poc.utils.before_job"]
# after_job = ["cresco_portal_poc.utils.after_job"]

# User Data Protection
# --------------------

# user_data_fields = [
# 	{
# 		"doctype": "{doctype_1}",
# 		"filter_by": "{filter_by}",
# 		"redact_fields": ["{field_1}", "{field_2}"],
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_2}",
# 		"filter_by": "{filter_by}",
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_3}",
# 		"strict": False,
# 	},
# 	{
# 		"doctype": "{doctype_4}"
# 	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"cresco_portal_poc.auth.validate"
# ]

# Automatically update python controller files with type annotations for this app.
# export_python_type_annotations = True

# default_log_clearing_doctypes = {
# 	"Logging DocType Name": 30  # days to retain logs
# }

# Translation
# ------------
# List of apps whose translatable strings should be excluded from this app's translations.
# ignore_translatable_strings_from = []

