from . import db

class Provider(db.Model):
    __tablename__ = 'providers'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    energy_plans = db.relationship("EnergyPlan", back_populates="provider")
