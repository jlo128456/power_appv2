from .auth_routes import auth_bp
from .user_routes import user_bp
from .plan_routes import plan_bp
from .usage_routes import usage_bp

def register_routes(app):
    app.register_blueprint(auth_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(plan_bp)
    app.register_blueprint(usage_bp)
