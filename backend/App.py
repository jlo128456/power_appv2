# Entry point for Flask framework
from flask import Flask, jsonify, request
from flask_cors import CORS
from models import db, EnergyPlan, User
from sqlalchemy.exc import SQLAlchemyError
from werkzeug.security import generate_password_hash
import os

app = Flask(__name__)

# Configure database
basedir = os.path.abspath(os.path.dirname(__file__))
db_path = os.path.join(basedir, "database", "energy.db")
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{db_path}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database and enable CORS
db.init_app(app)
CORS(app)

# Home route to check server status
@app.route('/')
def index():
    return jsonify(message="Flask API is running."), 200

# Get all energy plans
@app.route('/api/energy-plans')
def get_energy_plans():
    try:
        plans = EnergyPlan.query.all()
        return jsonify([plan.to_dict() for plan in plans]), 200
    except SQLAlchemyError:
        return jsonify(error="Failed to fetch energy plans"), 500

# Sign up a new user
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    try:
        # Create user with hashed password
        user = User(
            username=data['username'],
            password=generate_password_hash(data['password']),
            postcode=data['postcode']
        )
        db.session.add(user)
        db.session.commit()
        return jsonify(user.to_dict()), 201
    except (KeyError, SQLAlchemyError) as e:
        print(e)
        return jsonify(error="Invalid user data or database error"), 400

# Get all users
@app.route('/api/users')
def get_users():
    try:
        users = User.query.all()
        return jsonify([user.to_dict() for user in users]), 200
    except SQLAlchemyError:
        return jsonify(error="Failed to fetch users"), 500

# Get energy plans filtered by postcode group
@app.route('/api/energy-plans-by-postcode/<postcode>')
def get_plans_by_postcode(postcode):
    postcode_group = map_postcode_to_group(postcode)
    try:
        plans = EnergyPlan.query.filter_by(postcode=postcode_group).all()
        if not plans:
            return jsonify(error="No plans found for that postcode"), 404
        return jsonify([plan.to_dict() for plan in plans]), 200
    except SQLAlchemyError:
        return jsonify(error="Database error"), 500

# Group postcodes by their first digit
def map_postcode_to_group(postcode):
    if not postcode or not postcode.isdigit():
        return "4000"
    return {
        "2": "2000",
        "3": "3000",
        "4": "4000",
        "6": "6000"
    }.get(postcode[0], "4000")

# Error for page not found
@app.errorhandler(404)
def not_found(error):
    return jsonify(error="Resource not found"), 404

# Error for internal server failure
@app.errorhandler(500)
def internal_error(error):
    return jsonify(error="Internal server error"), 500

# Run the app
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)

