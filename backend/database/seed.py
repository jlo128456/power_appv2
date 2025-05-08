# seed.py

import sys
import os
import random
from flask import Flask
from models import db, Provider, EnergyPlan, User
from werkzeug.security import generate_password_hash

# Add parent directory to Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# Initialize Flask app
app = Flask(__name__)
basedir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
db_path = os.path.join(basedir, "database", "energy.db")
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{db_path}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

def seed():
    with app.app_context():
        print("🔄 Resetting energy.db...")
        db.drop_all()
        db.create_all()

        # ── Seed 5 Providers ───────────────────────────────
        print("🌱 Seeding providers...")
        providers = [
            Provider(name="Green Energy Co"),
            Provider(name="PowerMax Australia"),
            Provider(name="SolarGo"),
            Provider(name="EcoWatt"),
            Provider(name="VoltNation")
        ]
        db.session.add_all(providers)
        db.session.commit()

        # ── Seed Dynamic Energy Plans by Postcode ───────────
        print("⚡ Seeding energy plans...")
        postcode_groups = ["2000", "3000", "4000", "6000"]
        states = {"2": "NSW", "3": "VIC", "4": "QLD", "6": "WA"}
        plans = []

        for postcode in postcode_groups:
            state = states.get(postcode[0], "NSW")
            for i in range(3):  # 3 plans per postcode
                provider = providers[(i + postcode_groups.index(postcode)) % len(providers)]
                plan = EnergyPlan(
                    plan_name=f"{provider.name} Plan {i+1} - {postcode}",
                    usage_rate_cents=round(random.uniform(20.0, 35.0), 2),
                    supply_charge_cents=round(random.uniform(70.0, 100.0), 2),
                    solar_feed_in_cents=round(random.uniform(5.0, 15.0), 2),
                    contract_length_months=random.choice([12, 24]),
                    green_energy_percent=random.choice([10, 50, 100]),
                    postcode=postcode,
                    state=state,
                    fact_sheet_url=f"https://example.com/fact-sheet/{postcode}/{i+1}",
                    provider_id=provider.id
                )
                plans.append(plan)
                db.session.add(plan)

        db.session.commit()

        # ── Seed Users ─────────────────────────────────────
        print("👤 Seeding users...")
        users = [
            User(email="alice@example.com", password=generate_password_hash("alice123"), postcode="3000"),
            User(email="bob@example.com", password=generate_password_hash("bob123"), postcode="3000"),
            User(email="charlie@example.com", password=generate_password_hash("charlie123"), postcode="4000"),
            User(email="diana@example.com", password=generate_password_hash("diana123"), postcode="2000"),
            User(email="ethan@example.com", password=generate_password_hash("ethan123"), postcode="6000"),
        ]
        db.session.add_all(users)
        db.session.commit()

        # ── Assign Favorites ───────────────────────────────
        print("⭐ Assigning favorites...")
        all_plans = EnergyPlan.query.all()
        alice, bob, charlie, diana, ethan = User.query.all()

        alice.favorites.extend([all_plans[0], all_plans[2]])
        bob.favorites.extend([all_plans[1], all_plans[3]])
        charlie.favorites.append(all_plans[4])
        diana.favorites.extend([all_plans[5], all_plans[6]])
        ethan.favorites.append(all_plans[-1])

        db.session.commit()

        print("✅ Seeding complete! Providers, plans, users, and favorites inserted.")

if __name__ == "__main__":
    seed()
