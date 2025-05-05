from sqlalchemy import (
    Column, Integer, String, Float, ForeignKey, Table, Text
)
from sqlalchemy.orm import relationship, declarative_base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

Base = declarative_base()
engine = create_engine("sqlite:///energy.db", echo=False)
SessionLocal = sessionmaker(bind=engine)

# ── Join Table ────────────────────────────────
user_favorites = Table(
    'user_favorites', Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id'), primary_key=True),
    Column('plan_id', Integer, ForeignKey('energy_plans.id'), primary_key=True)
)

# ── Provider ──────────────────────────────────
class Provider(Base):
    __tablename__ = 'providers'

    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False)

    energy_plans = relationship("EnergyPlan", back_populates="provider")

# ── EnergyPlan ────────────────────────────────
class EnergyPlan(Base):
    __tablename__ = 'energy_plans'

    id = Column(Integer, primary_key=True)
    plan_name = Column(String, nullable=False)
    usage_rate_cents = Column(Float, nullable=False)
    supply_charge_cents = Column(Float, nullable=False)
    solar_feed_in_cents = Column(Float)
    contract_length_months = Column(Integer)
    green_energy_percent = Column(Integer)
    postcode = Column(String)
    state = Column(String)
    fact_sheet_url = Column(Text)

    provider_id = Column(Integer, ForeignKey('providers.id'))
    provider = relationship("Provider", back_populates="energy_plans")

    favorited_by = relationship("User", secondary=user_favorites, back_populates="favorites")

# ── User ──────────────────────────────────────
class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)

    favorites = relationship("EnergyPlan", secondary=user_favorites, back_populates="favorited_by")
