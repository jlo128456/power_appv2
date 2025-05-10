from flask import Blueprint, request
from models import db, User, UsageHistory
from werkzeug.security import check_password_hash
from helper import get_request_data, json_response

auth_bp = Blueprint("auth", __name__)

@auth_bp.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    postcode = data.get("postcode")
    usage_data = data.get("usage_history", [])

    if not all([email, password, postcode]):
        return json_response({"error": "Missing required fields"}, 400)

    user = User(email=email, postcode=postcode)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()  # Commit first to get user.id

    # Add usage history if present
    if isinstance(usage_data, list):
        for entry in usage_data:
            month = entry.get("month")
            kwh = entry.get("kwh_used")
            if month and kwh is not None:
                usage = UsageHistory(user_id=user.id, month=month, kwh_used=float(kwh))
                db.session.add(usage)
        db.session.commit()

    return json_response(user.to_dict(), 201)


@auth_bp.route('/api/login', methods=['POST'])
def login():
    email, password = get_request_data("email", "password")
    user = User.query.filter_by(email=email).first()
    if user and check_password_hash(user.password, password):
        return json_response({"user": user.to_dict()})
    return json_response({"error": "Invalid credentials"}, 401)
