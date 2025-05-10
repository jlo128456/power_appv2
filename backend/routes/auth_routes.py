from flask import Blueprint
from models import User
from werkzeug.security import check_password_hash
from helper import get_request_data, json_response, handle_db_commit

auth_bp = Blueprint("auth", __name__)

@auth_bp.route('/api/signup', methods=['POST'])
def signup():
    email, password, postcode = get_request_data("email", "password", "postcode")
    if not all([email, password, postcode]):
        return json_response({"error": "Missing required fields"}, 400)
    user = User(email=email, postcode=postcode)
    user.set_password(password)
    return json_response(user.to_dict(), 201) if handle_db_commit(user) else json_response({"error": "Signup failed"}, 400)

@auth_bp.route('/api/login', methods=['POST'])
def login():
    email, password = get_request_data("email", "password")
    user = User.query.filter_by(email=email).first()
    return json_response({"user": user.to_dict()}) if user and check_password_hash(user.password, password) else json_response({"error": "Invalid credentials"}, 401)
