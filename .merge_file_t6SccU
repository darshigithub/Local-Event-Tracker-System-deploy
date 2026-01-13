from flask import Blueprint, request, jsonify

from controllers.payment import (

    create_payment,

    get_all_payments,

    get_payment_by_id,

    update_payment, 

    delete_payment

)
 
payment_bp = Blueprint("payment_bp", __name__)
 
# CREATE

@payment_bp.route("/payments_create", methods=["POST"])

def add_payment():

    data = request.get_json()

    if not data:

        return jsonify({"error": "Request body must be JSON"}), 400

    result, status = create_payment(data)

    return jsonify(result), status
 
# READ ALL

@payment_bp.route("/payments_read", methods=["GET"])

def list_payments():

    result, status = get_all_payments()

    return jsonify(result), status
 
# READ ONE

@payment_bp.route("/payments_readone/<int:payment_id>", methods=["GET"])

def get_payment(payment_id):

    result, status = get_payment_by_id(payment_id)

    return jsonify(result), status
 
# UPDATE

@payment_bp.route("/payments_update/<int:payment_id>", methods=["PUT", "PATCH"])

def modify_payment(payment_id):

    data = request.get_json()

    if not data:

        return jsonify({"error": "Request body must be JSON"}), 400

    result, status = update_payment(payment_id, data)

    return jsonify(result), status
 
# DELETE

@payment_bp.route("/payments_delete/<int:payment_id>", methods=["DELETE"])

def remove_payment(payment_id):

    result, status = delete_payment(payment_id)

    return jsonify(result), status
