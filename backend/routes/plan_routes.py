from flask import Blueprint
from models.energy_plan import EnergyPlan
from sqlalchemy.exc import SQLAlchemyError
from helper import json_response, map_postcode_to_group

plan_bp = Blueprint("plan", __name__)

@plan_bp.route('/api/energy-plans')
def get_energy_plans():
    try:
        return json_response([p.to_dict() for p in EnergyPlan.query.all()])
    except SQLAlchemyError:
        return json_response({"error": "Failed to fetch plans"}, 500)

@plan_bp.route('/api/energy-plans-by-postcode/<postcode>')
def plans_by_postcode(postcode):
    try:
        plans = EnergyPlan.query.filter_by(postcode=map_postcode_to_group(postcode)).all()
        return json_response([p.to_dict() for p in plans]) if plans else json_response({"error": "No plans found"}, 404)
    except SQLAlchemyError:
        return json_response({"error": "Database error"}, 500)
