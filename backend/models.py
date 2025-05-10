from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

# ── Join Table ─────────────────────────────────────
user_favorites = db.Table(
    'user_favorites',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('plan_id', db.Integer, db.ForeignKey('energy_plans.id'), primary_key=True)
)

# ── Provider ───────────────────────────────────────
class Provider(db.Model):
    __tablename__ = 'providers'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    energy_plans = db.relationship("EnergyPlan", back_populates="provider")

# ── EnergyPlan ─────────────────────────────────────
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

# ── UsageHistory ───────────────────────────────────
class UsageHistory(db.Model):
    __tablename__ = 'usage_histories'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    month = db.Column(db.String, nullable=False)
    kwh_used = db.Column(db.Float, nullable=False)
    user = db.relationship("User", back_populates="usage_histories")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "month": self.month,
            "kwh_used": self.kwh_used
        }

# ── User ───────────────────────────────────────────
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    postcode = db.Column(db.String)
    favorites = db.relationship("EnergyPlan", secondary=user_favorites, back_populates="favorited_by")
    usage_histories = db.relationship("UsageHistory", back_populates="user", cascade="all, delete-orphan")

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "postcode": self.postcode
        }

