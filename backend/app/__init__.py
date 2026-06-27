import json
import sqlite3
from flask import Flask
from flask_cors import CORS
from .routes import resume_api, DB_FILE, get_db_connection

def init_db():
    """Initializes SQLite layout tracking matching your exact layout state format."""
    conn = get_db_connection()  # uses the same absolute path as routes.py
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS resume_store (
            id INTEGER PRIMARY KEY,
            title TEXT,
            resume_data TEXT
        )
    ''')

    cursor.execute("SELECT COUNT(*) FROM resume_store WHERE id = 1")
    if cursor.fetchone()[0] == 0:
        default_resume = {
            "title": "Premium Resume Profile",
            "basics": {
                "full_name": "",
                "role": "",
                "email": "",
                "phone": "",
                "website": "",
                "address": "",
                "about_me": ""
            },
            "skills": [],
            "education": [],
            "work_experience": [],
            "references": []
        }
        cursor.execute(
            "INSERT INTO resume_store (id, title, resume_data) VALUES (?, ?, ?)",
            (1, default_resume["title"], json.dumps(default_resume))
        )
        conn.commit()
    conn.close()

def create_app():
    app = Flask(__name__)

    # Fully open CORS so localhost:5173 faces zero request blocks
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Ensure database and table exist on every cold start
    init_db()

    # Register Blueprint routes
    app.register_blueprint(resume_api)

    return app