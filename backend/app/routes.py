import json
import sqlite3
from flask import Blueprint, request, jsonify

# Establish the modular Blueprint
resume_api = Blueprint('resume_api', __name__)

DB_FILE = "resume_database.db"

def get_db_connection():
    conn = sqlite3.connect(DB_FILE)
    # Allows retrieving rows as dictionaries rather than tuples
    conn.row_factory = sqlite3.Row
    return conn

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
            # Safely transform the stringified data back into a valid Python Dict
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