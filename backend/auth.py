from flask import Blueprint, request, jsonify
import bcrypt, jwt, sqlite3

auth_bp = Blueprint("auth", __name__)
SECRET = "secretkey"

def get_db():
    return sqlite3.connect("users.db")

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json

    hashed = bcrypt.hashpw(data["password"].encode(), bcrypt.gensalt())

    conn = get_db()
    try:
        conn.execute(
            "INSERT INTO users (email, password) VALUES (?, ?)",
            (data["email"], hashed)
        )
        conn.commit()
        return jsonify({"message": "User registered"})
    except:
        return jsonify({"error": "User already exists"}), 400


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json

    conn = get_db()
    user = conn.execute(
        "SELECT * FROM users WHERE email=?",
        (data["email"],)
    ).fetchone()

    if user and bcrypt.checkpw(data["password"].encode(), user[2]):
        token = jwt.encode({"user_id": user[0]}, SECRET, algorithm="HS256")
        return jsonify({"token": token})

    return jsonify({"error": "Invalid credentials"}), 401