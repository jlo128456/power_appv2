from flask import Blueprint, request
from models import db
from models.user import User
from models.usage_history import UsageHistory
from helper import get_request_data, json_response, handle_db_commit

usage_bp = Blueprint("usage", __name__)

@usage_bp.route('/api/users/<int:user_id>/usage', methods=['POST'])
def create_usage(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json()

    # Support both single and multiple entries
    usage_entries = data if isinstance(data, list) else [data]
    created = []

    for entry in usage_entries:
        month = entry.get("month")
        kwh_used = entry.get("kwh_used")
        if not month or kwh_used is None:
            continue  # skip invalid entry
        usage = UsageHistory(user_id=user.id, month=month, kwh_used=float(kwh_used))
        db.session.add(usage)
        created.append(usage)

    try:
        db.session.commit()
        return json_response([u.to_dict() for u in created], 201)
    except:
        db.session.rollback()
        return json_response({"error": "Failed to save usage entries"}, 500)

@usage_bp.route('/api/users/<int:user_id>/usage', methods=['GET'])
def get_usage(user_id):
    user = User.query.get_or_404(user_id)
    usage = UsageHistory.query.filter_by(user_id=user.id).all()
    return json_response([u.to_dict() for u in usage])

@usage_bp.route('/api/usage/<int:usage_id>', methods=['PATCH'])
def update_usage(usage_id):
    usage = UsageHistory.query.get_or_404(usage_id)
    month, kwh_used = get_request_data("month", "kwh_used")
    if month: usage.month = month
    if kwh_used is not None: usage.kwh_used = float(kwh_used)
    return json_response(usage.to_dict()) if handle_db_commit() else json_response({"error": "Update failed"}, 400)

@usage_bp.route('/api/usage/<int:usage_id>', methods=['DELETE'])
def delete_usage(usage_id):
    usage = UsageHistory.query.get_or_404(usage_id)
    try:
        db.session.delete(usage)
        db.session.commit()
        return '', 204
    except:
        db.session.rollback()
        return json_response({"error": "Delete failed"}, 500)
