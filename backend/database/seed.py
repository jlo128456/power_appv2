import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from models import Base, engine, SessionLocal, Provider, EnergyPlan, User

def seed():
    # Create database tables
    Base.metadata.create_all(engine)

    # Start database session
    session = SessionLocal()

    # Add energy providers
    providers = [
        Provider(name="AGL"),
        Provider(name="Origin"),
        Provider(name="EnergyAustralia"),
        Provider(name="Red Energy"),
        Provider(name="Powershop")
    ]
    session.add_all(providers)
    session.commit()

    # Get provider references
    agl = session.query(Provider).filter_by(name="AGL").first()
    origin = session.query(Provider).filter_by(name="Origin").first()
    eaus = session.query(Provider).filter_by(name="EnergyAustralia").first()
    red = session.query(Provider).filter_by(name="Red Energy").first()
    powershop = session.query(Provider).filter_by(name="Powershop").first()

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
    session.add_all(plans)
    session.commit()

    # Add users
    users = [
        User(name="Alice", email="alice@example.com"),
        User(name="Bob", email="bob@example.com"),
        User(name="Charlie", email="charlie@example.com"),
        User(name="Diana", email="diana@example.com"),
        User(name="Ethan", email="ethan@example.com")
    ]
    session.add_all(users)
    session.commit()

    # Add favorite plans for each user
    plans = session.query(EnergyPlan).all()
    alice, bob, charlie, diana, ethan = session.query(User).all()

    alice.favorites.extend([plans[0], plans[2]])
    bob.favorites.extend([plans[1], plans[3]])
    charlie.favorites.append(plans[4])
    diana.favorites.extend([plans[1], plans[4]])
    ethan.favorites.append(plans[0])

    session.commit()
    session.close()

    print("Seeded mock providers, energy plans, 5 users, and their favorites into energy.db.")

if __name__ == "__main__":
    seed()
