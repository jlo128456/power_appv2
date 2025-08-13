from . import db

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

