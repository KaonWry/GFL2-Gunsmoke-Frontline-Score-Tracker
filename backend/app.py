from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os
import pandas as pd

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

@app.route('/get_attempts', methods=['GET'])
def get_attempts():
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    db_path = os.path.join(backend_dir, "raid_data.db")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, player_name, score, doll1, doll2, doll3, doll4, doll5, date
        FROM attempts
        ORDER BY id DESC
    """)
    rows = cursor.fetchall()
    conn.close()
    attempts = []
    for row in rows:
        attempts.append({
            "id": row[0],
            "player_name": row[1],
            "score": row[2],
            "doll1": row[3],
            "doll2": row[4],
            "doll3": row[5],
            "doll4": row[6],
            "doll5": row[7],
            "date": row[8]
        })
    return jsonify(attempts)

@app.route('/delete_attempt/<int:attempt_id>', methods=['DELETE'])
def delete_attempt(attempt_id):
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    db_path = os.path.join(backend_dir, "raid_data.db")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM attempts WHERE id = ?", (attempt_id,))
    conn.commit()
    deleted = cursor.rowcount
    conn.close()
    if deleted:
        return jsonify({'message': f'Attempt with id {attempt_id} deleted.'})
    else:
        return jsonify({'error': f'No attempt found with id {attempt_id}.'}), 404

@app.route('/recap_players', methods=['GET'])
def recap_players():
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    db_path = os.path.join(backend_dir, "raid_data.db")
    conn = sqlite3.connect(db_path)
    df = pd.read_sql_query("SELECT player_name, score FROM attempts", conn)
    conn.close()
    if df.empty:
        return jsonify([])
    recap_df = df.groupby('player_name').agg(
        highest_score=pd.NamedAgg(column='score', aggfunc='max'),
        total_score=pd.NamedAgg(column='score', aggfunc='sum')
    ).reset_index().sort_values('total_score', ascending=False)
    recap = recap_df.to_dict(orient='records')
    return jsonify(recap)

if __name__ == '__main__':
    app.run(debug=True)