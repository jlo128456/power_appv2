from flask import Blueprint, request, jsonify
from models import db, User
from sqlalchemy.exc import SQLAlchemyError
from werkzeug.security import generate_password_hash, check_password_hash

# Create a Blueprint for auth-related routes
auth_bp = Blueprint('auth', __name__)

# Route to register a new user
@auth_bp.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    try:
        # Create new user with hashed password
        new_user = User(
            username=data['username'],
            password=generate_password_hash(data['password']),
            postcode=data['postcode']
        )
        db.session.add(new_user)
        db.session.commit()
        return jsonify(new_user.to_dict()), 201
    except (KeyError, SQLAlchemyError) as e:
        print(e)
        return jsonify(error="Signup failed"), 400

# Optional: route to login a user
@auth_bp.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    try:
        user = User.query.filter_by(username=data['username']).first()
        if user and check_password_hash(user.password, data['password']):
            return jsonify(message="Login successful", user=user.to_dict()), 200
        else:
            return jsonify(error="Invalid username or password"), 401
    except (KeyError, SQLAlchemyError):
        return jsonify(error="Login failed"), 400
