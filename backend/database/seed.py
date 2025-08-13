# seed.py
import os
import sys
import random
from flask import Flask

# ── Add backend root to sys.path ──────────────────────────────────────────────
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.append(BASE_DIR)

from models import db
from models.provider import Provider
from models.energy_plan import EnergyPlan
from models.user import User
from models.usage_history import UsageHistory

app = Flask(__name__)

# SQLite database path
db_path = os.path.join(BASE_DIR, "database", "energy.db")  # ensures correct path
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{db_path}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

def seed():
    with app.app_context():
        print("Resetting database...")
        db.drop_all()
        db.create_all()

        # Providers
        print("Seeding providers...")
        providers = [
            Provider(name="Green Energy Co"),
            Provider(name="PowerMax Australia"),
            Provider(name="SolarGo"),
            Provider(name="EcoWatt"),
            Provider(name="VoltNation"),
        ]
        db.session.add_all(providers)
        db.session.commit()

        # Energy Plans
        print("Seeding energy plans...")
        postcode_groups = ["2000", "3000", "4000", "6000"]
        states = {"2": "NSW", "3": "VIC", "4": "QLD", "6": "WA"}

        for postcode in postcode_groups:
            state = states.get(postcode[0], "NSW")
            for i in range(3):
                provider = providers[(i + postcode_groups.index(postcode)) % len(providers)]
                plan = EnergyPlan(
                    plan_name=f"{provider.name} Plan {i+1} - {postcode}",
                    usage_rate_cents=round(random.uniform(20, 35), 2),
                    supply_charge_cents=round(random.uniform(70, 100), 2),
                    solar_feed_in_cents=round(random.uniform(5, 15), 2),
                    contract_length_months=random.choice([12, 24]),
                    green_energy_percent=random.choice([10, 50, 100]),
                    postcode=postcode,
                    state=state,
                    fact_sheet_url=f"https://example.com/fact-sheet/{postcode}/{i+1}",
                    provider_id=provider.id,
                )
                db.session.add(plan)
        db.session.commit()

        # Users
        print("Seeding users...")
        users = []
        for email, pwd, pc in [
            ("alice@example.com", "alice1234", "3000"),
            ("bob@example.com", "bob12345", "3000"),
            ("charlie@example.com", "charlie123", "4000"),
            ("diana@example.com", "diana1234", "2000"),
            ("ethan@example.com", "ethan1234", "6000"),
        ]:
            u = User(email=email, postcode=pc)
            u.set_password(pwd)
            users.append(u)
        db.session.add_all(users)
        db.session.commit()

        # Favourites
        print("Assigning favourites...")
        all_plans = EnergyPlan.query.all()
        if len(all_plans) >= 7:
            users[0].favorites.extend([all_plans[0], all_plans[2]])
            users[1].favorites.extend([all_plans[1], all_plans[3]])
            users[2].favorites.append(all_plans[4])
            users[3].favorites.extend([all_plans[5], all_plans[6]])
            users[4].favorites.append(all_plans[-1])
        db.session.commit()

        # Usage History
        print("Seeding usage history...")
        months = ["2024-11", "2024-12", "2025-01"]
        for u in users:
            for month in months:
                db.session.add(
                    UsageHistory(user_id=u.id, month=month, kwh_used=round(random.uniform(400, 700), 1))
                )
        db.session.commit()

        print("Seeding complete.")

if __name__ == "__main__":
    seed()
