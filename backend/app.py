from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)
CORS(app)

def add_attempt_to_db(player_name, score, dolls, db_name="raid_data.db"):
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    db_path = os.path.join(backend_dir, db_name)
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO attempts (player_name, score, doll1, doll2, doll3, doll4, doll5)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (player_name, score, *dolls))
    conn.commit()
    conn.close()

@app.route('/add_attempt', methods=['POST'])
def add_attempt():
    data = request.get_json()
    player_name = data.get('player_name')
    score = data.get('score')
    dolls = [
        data.get('doll1'),
        data.get('doll2'),
        data.get('doll3'),
        data.get('doll4'),
        data.get('doll5')
    ]
    if not player_name or score is None:
        return jsonify({'error': 'Missing player_name or score'}), 400
    try:
        add_attempt_to_db(player_name, int(score), dolls)
        # Build a descriptive message
        dolls_desc = ', '.join([d if d else '(none)' for d in dolls])
        message = (
            f"Added attempt: Player Name = '{player_name}', "
            f"Score = {score}, "
            f"Dolls = {dolls_desc}"
        )
        return jsonify({'message': message})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)