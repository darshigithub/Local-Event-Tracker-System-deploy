from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from models.user import User
from database.connection import db
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity
)
from datetime import timedelta

# ------------------- SIGNUP / CREATE USER -------------------
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
    new_user = User(name=name, email=email, password_hash=password_hash)

    db.session.add(new_user)
    db.session.commit()

    access_token = create_access_token(
        identity=str(new_user.user_id),
        additional_claims={"name": new_user.name, "email": new_user.email},
        expires_delta=timedelta(minutes=10)
    )
    refresh_token = create_refresh_token(identity=str(new_user.user_id), expires_delta=timedelta(days=7))

    return jsonify({
        "message": "User created successfully",
        "user": new_user.to_dict(),
        "access_token": access_token,
        "refresh_token": refresh_token
    }), 201


# ------------------- LOGIN USER -------------------
def login_user_controller():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"message": "Invalid email or password"}), 401

    access_token = create_access_token(
        identity=str(user.user_id),
        additional_claims={"name": user.name, "email": user.email},
        expires_delta=timedelta(minutes=10)
    )
    refresh_token = create_refresh_token(identity=str(user.user_id), expires_delta=timedelta(days=7))

    return jsonify({
        "message": "Login successful",
        "user": user.to_dict(),
        "access_token": access_token,
        "refresh_token": refresh_token
    }), 200


# ------------------- REFRESH TOKEN -------------------
@jwt_required(refresh=True)
def refresh_token_controller():
    current_user = get_jwt_identity()
    user = User.query.get(current_user)
    if not user:
        return jsonify({"message": "User not found"}), 404

    new_access_token = create_access_token(
        identity=str(user.user_id),
        additional_claims={"name": user.name, "email": user.email},
        expires_delta=timedelta(minutes=10)
    )

    return jsonify({"access_token": new_access_token}), 200


# ------------------- GET SINGLE USER -------------------
@jwt_required()
def get_user_controller(user_id):
    current_user_id = get_jwt_identity()
    if str(user_id) != str(current_user_id):
        return jsonify({"message": "Unauthorized"}), 403

    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    return jsonify({"user": user.to_dict()}), 200


# ------------------- GET ALL USERS -------------------
@jwt_required()
def get_all_users_controller():
    users = User.query.all()
    return jsonify({"users": [user.to_dict() for user in users]}), 200


# ------------------- UPDATE USER -------------------
@jwt_required()
def update_user_controller(user_id):
    current_user_id = get_jwt_identity()
    if str(user_id) != str(current_user_id):
        return jsonify({"message": "Unauthorized"}), 403

    data = request.get_json()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    user.name = data.get("name", user.name)
    user.email = data.get("email", user.email)
    if data.get("password"):
        user.password_hash = generate_password_hash(data.get("password"))

    db.session.commit()

    return jsonify({"message": "User updated successfully", "user": user.to_dict()}), 200


# ------------------- DELETE USER -------------------
@jwt_required()
def delete_user_controller(user_id):
    current_user_id = get_jwt_identity()
    if str(user_id) != str(current_user_id):
        return jsonify({"message": "Unauthorized"}), 403

    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()

    return jsonify({"message": "User deleted successfully"}), 200
