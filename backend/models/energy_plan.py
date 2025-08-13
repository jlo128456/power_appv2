from . import db, user_favorites

class EnergyPlan(db.Model):
    __tablename__ = 'energy_plans'
    id = db.Column(db.Integer, primary_key=True)
    plan_name = db.Column(db.String, nullable=False)
    usage_rate_cents = db.Column(db.Float, nullable=False)
    supply_charge_cents = db.Column(db.Float, nullable=False)
    solar_feed_in_cents = db.Column(db.Float)
    contract_length_months = db.Column(db.Integer)
    green_energy_percent = db.Column(db.Integer)
    postcode = db.Column(db.String)
    state = db.Column(db.String)
    fact_sheet_url = db.Column(db.Text)
    provider_id = db.Column(db.Integer, db.ForeignKey('providers.id'))
    provider = db.relationship("Provider", back_populates="energy_plans")
    favorited_by = db.relationship("User", secondary=user_favorites, back_populates="favorites")

    def to_dict(self):
        return {
            "id": self.id,
            "plan_name": self.plan_name,
            "usage_rate_cents": self.usage_rate_cents,
            "supply_charge_cents": self.supply_charge_cents,
            "solar_feed_in_cents": self.solar_feed_in_cents,
            "contract_length_months": self.contract_length_months,
            "green_energy_percent": self.green_energy_percent,
            "postcode": self.postcode,
            "state": self.state,
            "provider_name": self.provider.name if self.provider else None
        }
