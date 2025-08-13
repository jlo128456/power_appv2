from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# ── Join Table ─────────────────────────────────────
user_favorites = db.Table(
    'user_favorites',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('plan_id', db.Integer, db.ForeignKey('energy_plans.id'), primary_key=True)
)

