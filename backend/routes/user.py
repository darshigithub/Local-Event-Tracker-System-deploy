from flask import Blueprint
from controllers.user import (
    create_user_controller,
    update_user_controller,
    get_all_users_controller,
    login_user_controller
)

user_bp = Blueprint("user_bp", __name__)

@user_bp.route("/users", methods=["POST"])
def create_user():
    return create_user_controller() 

@user_bp.route("/login", methods=["POST"])
def login_user():
    return login_user_controller()


@user_bp.route("/users/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    return update_user_controller(user_id)


@user_bp.route("/users", methods=["GET"])
def get_all_users():
    return get_all_users_controller()
