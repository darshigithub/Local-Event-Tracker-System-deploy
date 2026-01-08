from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from models.user import User
from database.connection import db

# CREATE USER
def create_user_controller():
    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({"message": "All fields are required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Email already exists"}), 409

    password_hash = generate_password_hash(password)

    new_user = User(
        name=name,
        email=email,
        password_hash=password_hash
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "message": "User created successfully",
        "user": new_user.to_dict()
    }), 201


def login_user_controller():
    data = request.get_json() 

    email = data.get("email")
    password = data.get("password")

    print(email, password)

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400 

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"message": "Invalid email or password"}), 401

    if not check_password_hash(user.password_hash, password):
        return jsonify({"message": "Invalid email or password"}), 401

    return jsonify({
        "message": "Login successful",
        "user": user.to_dict()
    }), 200


# UPDATE USER
def update_user_controller(user_id):
    data = request.get_json()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404

    user.name = data.get("name", user.name)
    user.email = data.get("email", user.email)

    if data.get("password"):
        user.password_hash = generate_password_hash(data.get("password"))

    db.session.commit()

    return jsonify({
        "message": "User updated successfully",
        "user": user.to_dict()
    }), 200


# GET ALL USERS
def get_all_users_controller():
    users = User.query.all()

    return jsonify({
        "users": [user.to_dict() for user in users]
    }), 200
