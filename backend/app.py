from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from models import db
from routes import register_routes
import os

app = Flask(__name__)
basedir = os.path.abspath(os.path.dirname(__file__))
db_path = os.path.join(basedir, "database", "energy.db")
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{db_path}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
migrate = Migrate(app, db)
CORS(app)

register_routes(app)

@app.route('/')
def index():
    return {"message": "Flask API is running."}

if __name__ == '__main__':
    app.run(debug=True)
