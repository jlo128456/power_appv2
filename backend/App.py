# Flask app entry point
from flask import Flask, jsonify, request
from flask_cors import CORS
from models import db, EnergyPlan, User
from sqlalchemy.exc import SQLAlchemyError
from werkzeug.security import generate_password_hash, check_password_hash
import traceback
import os

app = Flask(__name__)

# Setup database path
basedir = os.path.abspath(os.path.dirname(__file__))
db_path = os.path.join(basedir, "database", "energy.db")
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{db_path}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database and allow CORS
db.init_app(app)
CORS(app)

# Test route
@app.route('/')
def index():
    return jsonify(message="Flask API is running."), 200

# Signup a new user
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    try:
        user = User(
            email=data['email'],
            password=generate_password_hash(data['password']),
            postcode=data['postcode']
        )
        db.session.add(user)
        db.session.commit()
        return jsonify(user.to_dict()), 201
    except Exception as e:
        print("Signup error:", e)
        return jsonify(error="Signup failed"), 400


# Login existing user
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    try:
        user = User.query.filter_by(email=data['email']).first()
        if user and check_password_hash(user.password, data['password']):
            return jsonify({"user": user.to_dict()}), 200
        else:
            return jsonify({"error": "Invalid credentials"}), 401
    except Exception as e:
        print("Login error:", e)
        return jsonify({"error": "Login failed"}), 500

# Get all users
@app.route('/api/users')
def get_users():
    try:
        users = User.query.all()
        return jsonify([user.to_dict() for user in users]), 200
    except Exception as e:
        print("User fetch error:")
        traceback.print_exc()
        return jsonify(error="Failed to load users"), 500

# Get all energy plans
@app.route('/api/energy-plans')
def get_energy_plans():
    try:
        plans = EnergyPlan.query.all()
        return jsonify([plan.to_dict() for plan in plans]), 200
    except SQLAlchemyError:
        return jsonify(error="Failed to fetch plans"), 500

# Get plans by postcode group
@app.route('/api/energy-plans-by-postcode/<postcode>')
def get_plans_by_postcode(postcode):
    group = map_postcode_to_group(postcode)
    try:
        plans = EnergyPlan.query.filter_by(postcode=group).all()
        if not plans:
            return jsonify(error="No plans found"), 404
        return jsonify([plan.to_dict() for plan in plans]), 200
    except SQLAlchemyError:
        return jsonify(error="Database error"), 500

# Map postcode to main group
def map_postcode_to_group(postcode):
    if not postcode or not postcode.isdigit():
        return "4000"
    return {
        "2": "2000",
        "3": "3000",
        "4": "4000",
        "6": "6000"
    }.get(postcode[0], "4000")

# Error: page not found
@app.errorhandler(404)
def not_found(error):
    return jsonify(error="Not found"), 404

# Error: internal server error
@app.errorhandler(500)
def internal_error(error):
    return jsonify(error="Internal error"), 500

# Start the server
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
