from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from models import db
from routes import register_routes
import os

app = Flask(__name__)

# Fallback to local SQLite if DATABASE_URL is not set
basedir = os.path.abspath(os.path.dirname(__file__))
local_db = os.path.join(basedir, "database", "energy.db")

# Use SQLiteCloud or local SQLite
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
    "DATABASE_URL",
    f"sqlite:///{local_db}"
)

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Init extensions
db.init_app(app)
migrate = Migrate(app, db)
CORS(app)

# Register routes
register_routes(app)

@app.route('/')
def index():
    return {"message": "Flask API is running."}

if __name__ == '__main__':
    app.run(debug=True)
