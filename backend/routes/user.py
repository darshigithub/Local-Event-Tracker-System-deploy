from flask import Blueprint
from controllers.user import (
    create_user_controller,
    login_user_controller,
    refresh_token_controller,
    get_user_controller,
    get_all_users_controller,
    update_user_controller,
    delete_user_controller
)

user_bp = Blueprint("user_bp", __name__)

# ------------------- AUTH -------------------
user_bp.route("/users", methods=["POST"])(create_user_controller)   # Signup
user_bp.route("/login", methods=["POST"])(login_user_controller)    # Login
user_bp.route("/refresh", methods=["POST"])(refresh_token_controller)  # Refresh access token

# ------------------- USER CRUD -------------------
user_bp.route("/users/<int:user_id>", methods=["GET"])(get_user_controller)
user_bp.route("/users", methods=["GET"])(get_all_users_controller)
user_bp.route("/users/<int:user_id>", methods=["PUT"])(update_user_controller)
user_bp.route("/users/<int:user_id>", methods=["DELETE"])(delete_user_controller)
