import json
import sqlite3
import os
from flask import Blueprint, request, jsonify

# Establish the modular Blueprint
resume_api = Blueprint('resume_api', __name__)

# Use absolute path so DB is always found regardless of working directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_FILE = os.path.join(BASE_DIR, "resume_database.db")

def get_db_connection():
    conn = sqlite3.connect(DB_FILE)
    # Allows retrieving rows as dictionaries rather than tuples
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
    # Seed the default empty record so GET never returns 404 on first load
    cursor.execute("""
        INSERT OR IGNORE INTO resume_store (id, title, resume_data)
        VALUES (1, 'Premium Resume Profile', '{}')
    """)
    conn.commit()
    conn.close()

@resume_api.route('/')
def health():
    return jsonify({"status": "Forged Resume API is running 🔥"}), 200

@resume_api.route('/api/resume', methods=['GET'])
def get_resume():
    """
    Pulls the document out of SQLite, parses the data text column back 
    into an absolute JSON dictionary payload, and returns it to your frontend state.
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT resume_data FROM resume_store WHERE id = 1")
        row = cursor.fetchone()
        conn.close()

        if row:
            # Safely transform the stringified data back into a valid Python dict
            resume_data = json.loads(row['resume_data'])
            return jsonify({"status": "success", "resume_data": resume_data}), 200
        else:
            return jsonify({"status": "error", "message": "No profile entry exists in storage."}), 404

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@resume_api.route('/api/resume', methods=['POST'])
def save_resume():
    """
    Receives your full, nested frontend JSON state bundle, serializes 
    it, and updates it dynamically inside record ID 1.
    """
    try:
        incoming_data = request.get_json()
        if not incoming_data:
            return jsonify({"status": "error", "message": "Payload format is empty or unreadable"}), 400

        # Parse document title fallbacks accurately
        doc_title = incoming_data.get("title", "Premium Resume Profile")

        conn = get_db_connection()
        cursor = conn.cursor()

        # Overwrite our persistent record with the fresh frontend modifications
        cursor.execute(
            "UPDATE resume_store SET title = ?, resume_data = ? WHERE id = 1",
            (doc_title, json.dumps(incoming_data))
        )
        conn.commit()
        conn.close()

        return jsonify({"status": "success", "message": "Resume updated flawlessly"}), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500