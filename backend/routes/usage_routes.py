from flask import Blueprint
from models import db, User, UsageHistory
from helper import get_request_data, json_response, handle_db_commit

usage_bp = Blueprint("usage", __name__)

@usage_bp.route('/api/users/<int:user_id>/usage', methods=['POST'])
def create_usage(user_id):
    user = User.query.get_or_404(user_id)
    month, kwh_used = get_request_data("month", "kwh_used")
    if not month or kwh_used is None:
        return json_response({"error": "Month and kWh used required"}, 400)
    usage = UsageHistory(user_id=user.id, month=month, kwh_used=float(kwh_used))
    return json_response(usage.to_dict(), 201) if handle_db_commit(usage) else json_response({"error": "Failed to save usage"}, 500)

@usage_bp.route('/api/users/<int:user_id>/usage')
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
