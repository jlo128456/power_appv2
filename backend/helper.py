# helper.py for cleaner code

from flask import jsonify, request
import traceback
from models import db

def get_request_data(*fields, full=False):
    data = request.get_json()
    if full:
        return data
    return (data.get(f) for f in fields)

def json_response(payload=None, status=200):
    return jsonify(payload or {}), status

def handle_db_commit(obj=None):
    try:
        if obj:
            db.session.add(obj)
        db.session.commit()
        return True
    except Exception as e:
        print("Database error:", e)
        traceback.print_exc()
        db.session.rollback()
        return False

def map_postcode_to_group(postcode):
    return {"2": "2000", "3": "3000", "4": "4000", "6": "6000"}.get(postcode[0], "4000") if postcode and postcode.isdigit() else "4000"

print("helper.py loaded")