from flask import Blueprint, request, jsonify
from utils.code_executor import run_code

code_bp = Blueprint("code", __name__)

@code_bp.route("/run", methods=["POST"])
def run():
    data = request.json
    output = run_code(data["language"], data["code"])
    return jsonify({"output": output})