from flask import Blueprint
from models import db
from models.user import User
from helper import get_request_data, json_response, handle_db_commit

user_bp = Blueprint("user", __name__)

@user_bp.route('/api/users')
def get_users():
    return json_response([u.to_dict() for u in User.query.all()])

@user_bp.route('/api/users/<int:id>', methods=['PATCH'])
def update_user(id):
    user = User.query.get_or_404(id)
    email, postcode = get_request_data("email", "postcode")
    user.email = email or user.email
    user.postcode = postcode or user.postcode
    return json_response(user.to_dict()) if handle_db_commit() else json_response({"error": "Update failed"}, 400)

@user_bp.route('/api/users/<int:id>', methods=['DELETE'])
def delete_user(id):
    user = User.query.get_or_404(id)
    try:
        db.session.delete(user)
        db.session.commit()
        return '', 204
    except:
        db.session.rollback()
        return json_response({"error": "Delete failed"}, 500)
