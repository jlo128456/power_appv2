from flask import Flask, request
from flask_cors import CORS
from flask_migrate import Migrate
from models import db, EnergyPlan, User
from werkzeug.security import check_password_hash
from sqlalchemy.exc import SQLAlchemyError
from helper import get_request_data, json_response, handle_db_commit, map_postcode_to_group
import os

app = Flask(__name__)
basedir = os.path.abspath(os.path.dirname(__file__))
db_path = os.path.join(basedir, "database", "energy.db")
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{db_path}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
migrate = Migrate(app, db)
CORS(app)

@app.route('/')
def index():
    return json_response({"message": "Flask API is running."})

@app.route('/api/signup', methods=['POST'])
def signup():
    email, password, postcode = get_request_data("email", "password", "postcode")
    if not all([email, password, postcode]):
        return json_response({"error": "Missing required fields"}, 400)
    user = User(email=email, postcode=postcode)
    user.set_password(password)
    return json_response(user.to_dict(), 201) if handle_db_commit(user) else json_response({"error": "Signup failed"}, 400)

@app.route('/api/login', methods=['POST'])
def login():
    email, password = get_request_data("email", "password")
    user = User.query.filter_by(email=email).first()
    return json_response({"user": user.to_dict()}) if user and check_password_hash(user.password, password) else json_response({"error": "Invalid credentials"}, 401)

@app.route('/api/users')
def get_users():
    try:
        return json_response([u.to_dict() for u in User.query.all()])
    except:
        return json_response({"error": "Failed to load users"}, 500)

@app.route('/api/users/<int:id>', methods=['PATCH'])
def update_user(id):
    user = User.query.get_or_404(id)
    email, postcode = get_request_data("email", "postcode")
    user.email = email or user.email
    user.postcode = postcode or user.postcode
    return json_response(user.to_dict()) if handle_db_commit() else json_response({"error": "Update failed"}, 400)

@app.route('/api/users/<int:id>', methods=['DELETE'])
def delete_user(id):
    user = User.query.get_or_404(id)
    try:
        db.session.delete(user)
        db.session.commit()
        return '', 204
    except:
        db.session.rollback()
        return json_response({"error": "Delete failed"}, 500)

@app.route('/api/energy-plans')
def get_energy_plans():
    try:
        return json_response([p.to_dict() for p in EnergyPlan.query.all()])
    except SQLAlchemyError:
        return json_response({"error": "Failed to fetch plans"}, 500)

@app.route('/api/energy-plans-by-postcode/<postcode>')
def plans_by_postcode(postcode):
    try:
        plans = EnergyPlan.query.filter_by(postcode=map_postcode_to_group(postcode)).all()
        return json_response([p.to_dict() for p in plans]) if plans else json_response({"error": "No plans found"}, 404)
    except SQLAlchemyError:
        return json_response({"error": "Database error"}, 500)

@app.errorhandler(404)
def not_found(_): return json_response({"error": "Not found"}, 404)

@app.errorhandler(500)
def internal_error(_): return json_response({"error": "Internal error"}, 500)

if __name__ == '__main__':
    app.run(debug=True)
