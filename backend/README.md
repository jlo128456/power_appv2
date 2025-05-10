
# ⚡ Flask Energy Plan API

This is the backend for the **Energy Plan Comparison App**, built with Flask and SQLAlchemy. It handles user authentication, energy plan retrieval, and postcode-based filtering.

---

## 🚀 Features

- 🔐 User Signup & Login
- 🧑‍💼 CRUD for Users
- ⚡ Retrieve All Energy Plans
- 🏠 Filter Energy Plans by Postcode Group
- 🔄 SQLite database integration
- 🌐 CORS enabled for frontend access

---

## 🗂️ Project Structure

```
backend/
├── app.py               # Main Flask app
├── helper.py            # Utility functions for cleaner routes
├── models.py            # SQLAlchemy models for User and EnergyPlan
├── database/
│   └── energy.db        # SQLite database (auto-created)
```

---

## ⚙️ Setup Instructions

### 1. 📦 Install dependencies

Ensure you have Python 3.9+ installed. Then:

```bash
pip install Flask Flask-Cors SQLAlchemy Werkzeug
```

> (Optional) Create and activate a virtual environment first using `python -m venv venv`.

---

### 2. ▶️ Run the App

```bash
python app.py
```

You should see:  
`* Running on http://127.0.0.1:5000`

---

## 🔌 API Endpoints

| Method | Endpoint                             | Description                        |
|--------|--------------------------------------|------------------------------------|
| GET    | `/`                                   | Health check route                 |
| POST   | `/api/signup`                         | Register a new user                |
| POST   | `/api/login`                          | Login existing user                |
| GET    | `/api/users`                          | Get all users                      |
| PATCH  | `/api/users/<int:id>`                 | Update user by ID                  |
| DELETE | `/api/users/<int:id>`                 | Delete user by ID                  |
| GET    | `/api/energy-plans`                   | Fetch all energy plans             |
| GET    | `/api/energy-plans-by-postcode/<pc>`  | Plans based on postcode group      |

---

## 🛠 Models

### User
- `id`: Integer (Primary Key)
- `email`: String
- `password`: Hashed String
- `postcode`: String

### EnergyPlan
- `id`: Integer (Primary Key)
- `provider`: String
- `rate`: Float
- `plan_type`: String
- `postcode`: String

---

## 🧪 Seeding the Database

Create a custom `seed.py` script if you'd like to preload sample users and plans.

---

## 📬 Contact

For questions or improvements, email: [j.lo128456@gmail.com](mailto:j.lo128456@gmail.com)
