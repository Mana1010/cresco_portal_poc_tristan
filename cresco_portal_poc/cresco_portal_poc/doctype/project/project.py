# Copyright (c) 2026, Tristan and contributors
# For license information, please see license.txt

from frappe.model.document import Document

# Mirrors the POC's gTier()/gFee() logic exactly, so imported/edited records
# reproduce the same Tier the HTML prototype would show.
TIER_SEVERITY = ["Green", "Blue", "Amber", "Red"]


def score_tier(tier_factor, volume_factor):
	score = (tier_factor or 0) * (volume_factor or 0)
	if score <= 2:
		return "Green"
	if score <= 6:
		return "Blue"
	if score <= 9:
		return "Amber"
	return "Red"


def fee_tier(fee):
	fee = fee or 0
	if fee > 50000:
		return "Red"
	if fee > 20000:
		return "Amber"
	if fee > 5000:
		return "Blue"
	return "Green"


class Project(Document):
	def validate(self):
		self.complexity_score = (self.tier_factor or 0) * (self.volume_factor or 0)

		by_score = score_tier(self.tier_factor, self.volume_factor)
		by_fee = fee_tier(self.fee)
		self.tier = max(
			[by_score, by_fee], key=TIER_SEVERITY.index
		)
