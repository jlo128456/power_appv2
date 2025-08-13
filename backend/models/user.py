from werkzeug.security import generate_password_hash, check_password_hash
from os import getenv
from . import db, user_favorites

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    postcode = db.Column(db.String)

    favorites = db.relationship(
        "EnergyPlan",
        secondary=user_favorites,
        back_populates="favorited_by"
    )
    usage_histories = db.relationship(
        "UsageHistory",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    def set_password(self, password, *, method="scrypt", salt_length=16):
        """Hash and set the password (salted; default method = scrypt)."""
        if not isinstance(password, str) or len(password) < 8:
            raise ValueError("Password must be a string of at least 8 characters")
        self.password = generate_password_hash(password, method=method, salt_length=salt_length)

    def check_password(self, password, *, debug=False, auto_rehash=True):
        """
        Verify the password. If debug=True (or env DEBUG_PASSWORD=1),
        print method/salt/hash for local debugging only.
        """
        debug = debug or getenv("DEBUG_PASSWORD") == "1"

        if debug:
            print("Stored hash:", self.password)
            try:
                method, salt_b64, hash_b64 = self.password.split("$", 2)
                print("Method:", method)
                print("Salt (base64):", salt_b64)
                print("Hash (base64):", hash_b64)
            except ValueError:
                print("Unable to parse hash components")

        ok = check_password_hash(self.password, password)

        # Optional: seamlessly upgrade old hashes (e.g., pbkdf2) to scrypt
        if ok and auto_rehash and not self.password.startswith("scrypt:"):
            self.set_password(password)  # rehash with current defaults
            db.session.add(self)
            try:
                db.session.commit()
            except Exception:
                db.session.rollback()  # don't break login if commit fails

        return ok

    def to_dict(self):
        return {"id": self.id, "email": self.email, "postcode": self.postcode}
