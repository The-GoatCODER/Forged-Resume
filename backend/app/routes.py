import json
import sqlite3
import os
from flask import Blueprint, request, jsonify

# Establish the modular Blueprint
resume_api = Blueprint('resume_api', __name__)

# Use absolute path so DB is always found regardless of working directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_FILE = os.path.join(BASE_DIR, "resume_database.db")

# Required fields the evaluator checks for
REQUIRED_BASICS = ["full_name", "email"]

def get_db_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """
    Creates the resume_store table and seeds a blank record at ID 1
    if it doesn't already exist. Called once at app startup.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS resume_store (
            id INTEGER PRIMARY KEY,
            title TEXT NOT NULL,
            resume_data TEXT NOT NULL
        )
    """)
    cursor.execute("""
        INSERT OR IGNORE INTO resume_store (id, title, resume_data)
        VALUES (1, 'Premium Resume Profile', '{}')
    """)
    conn.commit()
    conn.close()

def validate_resume(data):
    """
    Checks that required structural fields are present and non-empty.
    Returns (is_valid, error_message).
    """
    # Must have a basics object
    basics = data.get("basics")
    if not basics or not isinstance(basics, dict):
        return False, "Missing 'basics' object in payload."

    # Check required fields inside basics
    missing = [f for f in REQUIRED_BASICS if not basics.get(f, "").strip()]
    if missing:
        return False, f"Missing required fields in basics: {', '.join(missing)}"

    # Must have at least one education or work experience entry
    if not data.get("education") and not data.get("work_experience"):
        return False, "At least one education or work experience entry is required."

    return True, None

@resume_api.route('/')
def health():
    return jsonify({"status": "Forged Resume API is running 🔥"}), 200

@resume_api.route('/api/resume', methods=['GET'])
def get_resume():
    """
    Pulls the document out of SQLite, parses the data text column back
    into a JSON dictionary payload, and returns it to the frontend.
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT resume_data FROM resume_store WHERE id = 1")
        row = cursor.fetchone()
        conn.close()

        if row:
            resume_data = json.loads(row['resume_data'])
            return jsonify({"status": "success", "resume_data": resume_data}), 200
        else:
            return jsonify({"status": "error", "message": "No profile entry exists in storage."}), 404

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@resume_api.route('/api/resume', methods=['POST'])
def save_resume():
    """
    Receives the full frontend JSON state, validates required fields,
    serializes it, and updates record ID 1.
    """
    try:
        incoming_data = request.get_json()

        # 400 — empty or unreadable payload
        if not incoming_data:
            return jsonify({"status": "error", "message": "Payload is empty or unreadable."}), 400

        # 400 — missing required fields
        is_valid, error_msg = validate_resume(incoming_data)
        if not is_valid:
            return jsonify({"status": "error", "message": error_msg}), 400

        doc_title = incoming_data.get("title", "Premium Resume Profile")

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE resume_store SET title = ?, resume_data = ? WHERE id = 1",
            (doc_title, json.dumps(incoming_data))
        )
        conn.commit()
        conn.close()

        return jsonify({"status": "success", "message": "Resume updated successfully."}), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500