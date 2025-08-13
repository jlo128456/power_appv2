from flask import Blueprint, request
from models import db
from models.user import User
from models.usage_history import UsageHistory
from helper import get_request_data, json_response

auth_bp = Blueprint("auth", __name__)

@auth_bp.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")
    postcode = data.get("postcode")
    usage_data = data.get("usage_history") or []

    if not (email and password and postcode):
        return json_response({"error": "Missing required fields"}, 400)

    user = User(email=email, postcode=postcode)
    try:
        user.set_password(password)  # uses scrypt (your User model)
    except ValueError as e:
        return json_response({"error": str(e)}, 400)

    db.session.add(user)
    db.session.flush()  # get user.id without committing yet

    if isinstance(usage_data, list):
        for entry in usage_data:
            month = entry.get("month")
            kwh = entry.get("kwh_used")
            if month and kwh is not None:
                db.session.add(UsageHistory(
                    user_id=user.id,
                    month=month,
                    kwh_used=float(kwh)
                ))

    db.session.commit()
    return json_response(user.to_dict(), 201)

@auth_bp.route('/api/login', methods=['POST'])
def login():
    email, password = get_request_data("email", "password")
    if not (email and password):
        return json_response({"error": "Missing email or password"}, 400)

    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):  # model method
        return json_response({"user": user.to_dict()})
    return json_response({"error": "Invalid credentials"}, 401)
