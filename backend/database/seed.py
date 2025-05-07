import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from flask import Flask
from models import db, Provider, EnergyPlan, User
from werkzeug.security import generate_password_hash

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database/energy.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

def seed():
    with app.app_context():
        db.drop_all()
        db.create_all()

        # Add energy providers
        providers = [
            Provider(name="AGL"),
            Provider(name="Origin"),
            Provider(name="EnergyAustralia"),
            Provider(name="Red Energy"),
            Provider(name="Powershop")
        ]
        db.session.add_all(providers)
        db.session.commit()

        # Get provider references
        agl = Provider.query.filter_by(name="AGL").first()
        origin = Provider.query.filter_by(name="Origin").first()
        eaus = Provider.query.filter_by(name="EnergyAustralia").first()
        red = Provider.query.filter_by(name="Red Energy").first()
        powershop = Provider.query.filter_by(name="Powershop").first()

        # Add energy plans
        plans = [
            EnergyPlan(
                plan_name="AGL Value Saver",
                usage_rate_cents=25.3,
                supply_charge_cents=98.5,
                solar_feed_in_cents=6.0,
                contract_length_months=12,
                green_energy_percent=20,
                postcode="2000",
                state="NSW",
                fact_sheet_url="https://agl.com.au/factsheets/value-saver",
                provider_id=agl.id
            ),
            EnergyPlan(
                plan_name="Origin Go Plan",
                usage_rate_cents=23.9,
                supply_charge_cents=95.0,
                solar_feed_in_cents=5.5,
                contract_length_months=12,
                green_energy_percent=25,
                postcode="3000",
                state="VIC",
                fact_sheet_url="https://origin.com.au/factsheets/go-plan",
                provider_id=origin.id
            ),
            EnergyPlan(
                plan_name="EnergyAustralia Total Home",
                usage_rate_cents=24.7,
                supply_charge_cents=90.0,
                solar_feed_in_cents=7.0,
                contract_length_months=24,
                green_energy_percent=15,
                postcode="4000",
                state="QLD",
                fact_sheet_url="https://energyaustralia.com.au/factsheets/total-home",
                provider_id=eaus.id
            ),
            EnergyPlan(
                plan_name="Red Living Energy Saver",
                usage_rate_cents=26.5,
                supply_charge_cents=101.0,
                solar_feed_in_cents=5.0,
                contract_length_months=24,
                green_energy_percent=100,
                postcode="2000",
                state="NSW",
                fact_sheet_url="https://redenergy.com.au/factsheets/living-saver",
                provider_id=red.id
            ),
            EnergyPlan(
                plan_name="Powershop Smart Saver",
                usage_rate_cents=25.0,
                supply_charge_cents=92.0,
                solar_feed_in_cents=8.0,
                contract_length_months=6,
                green_energy_percent=50,
                postcode="6000",
                state="WA",
                fact_sheet_url="https://powershop.com.au/factsheets/smart-saver",
                provider_id=powershop.id
            )
        ]
        db.session.add_all(plans)
        db.session.commit()

        # Add users
        users = [
            User(email="alice@example.com", password=generate_password_hash("alice123"), postcode="3000"),
            User(email="bob@example.com", password=generate_password_hash("bob123"), postcode="3000"),
            User(email="charlie@example.com", password=generate_password_hash("charlie123"), postcode="4000"),
            User(email="diana@example.com", password=generate_password_hash("diana123"), postcode="2000"),
            User(email="ethan@example.com", password=generate_password_hash("ethan123"), postcode="6000"),
        ]
        db.session.add_all(users)
        db.session.commit()

        # Add favorite plans
        all_plans = EnergyPlan.query.all()
        alice, bob, charlie, diana, ethan = User.query.all()

        alice.favorites.extend([all_plans[0], all_plans[2]])
        bob.favorites.extend([all_plans[1], all_plans[3]])
        charlie.favorites.append(all_plans[4])
        diana.favorites.extend([all_plans[1], all_plans[4]])
        ethan.favorites.append(all_plans[0])

        db.session.commit()
        print("✅ Seeded mock providers, plans, users, and favorites into energy.db.")

if __name__ == "__main__":
    seed()
