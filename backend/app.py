from flask import Flask, request, jsonify, Response
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
    max_attempts = 2*7 # 7 days long event, 2 attempts a day
    recap_df = df.groupby('player_name').agg(
        highest_score=pd.NamedAgg(column='score', aggfunc='max'),
        total_score=pd.NamedAgg(column='score', aggfunc='sum'),
        attempts=pd.NamedAgg(column='score', aggfunc='count')
    ).reset_index().sort_values('total_score', ascending=False)
    recap_df['participation_rate'] = recap_df['attempts'] / max_attempts
    recap_df['relative_efficiency'] = recap_df.apply(
        lambda row: row['total_score'] / (row['highest_score'] * row['attempts'])
        if row['highest_score'] > 0 and row['attempts'] > 0 else 0,
        axis=1
    )
    recap_df['absolute_efficiency'] = recap_df.apply(
        lambda row: row['total_score'] / (row['highest_score'] * max_attempts)
        if row['highest_score'] > 0 and max_attempts > 0 else 0,
        axis=1
    )
    recap_df['peak_average_gap'] = recap_df['highest_score'] - (recap_df['total_score'] / recap_df['attempts'])
    recap = recap_df.to_dict(orient='records')
    return jsonify(recap)

@app.route('/export_csv', methods=['GET'])
def export_csv():
    table = request.args.get('table', 'recap')
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    db_path = os.path.join(backend_dir, "raid_data.db")

    if table == 'log':
        # Export log/attempts table
        conn = sqlite3.connect(db_path)
        df = pd.read_sql_query("""
            SELECT id, player_name, score, doll1, doll2, doll3, doll4, doll5, date
            FROM attempts
            ORDER BY id DESC
        """, conn)
        conn.close()
        csv_data = df.to_csv(index=False)
        filename = "attempts_log.csv"
    else:
        # Export recap table (same as /recap_players but as CSV)
        conn = sqlite3.connect(db_path)
        df = pd.read_sql_query("SELECT player_name, score FROM attempts", conn)
        conn.close()
        if df.empty:
            csv_data = ""
        else:
            max_attempts = 7*2 # 7 day event, 2 attempts per day
            recap_df = df.groupby('player_name').agg(
                highest_score=pd.NamedAgg(column='score', aggfunc='max'),
                total_score=pd.NamedAgg(column='score', aggfunc='sum'),
                attempts=pd.NamedAgg(column='score', aggfunc='count')
            ).reset_index().sort_values('total_score', ascending=False)
            recap_df['participation_rate'] = recap_df['attempts'] / max_attempts
            recap_df['relative_efficiency'] = recap_df.apply(
                lambda row: row['total_score'] / (row['highest_score'] * row['attempts'])
                if row['highest_score'] > 0 and row['attempts'] > 0 else 0,
                axis=1
            )
            recap_df['absolute_efficiency'] = recap_df.apply(
                lambda row: row['total_score'] / (row['highest_score'] * max_attempts)
                if row['highest_score'] > 0 and max_attempts > 0 else 0,
                axis=1
            )
            recap_df['peak_average_gap'] = recap_df['highest_score'] - (recap_df['total_score'] / recap_df['attempts'])
            # Format as percent for efficiency columns
            recap_df['relative_efficiency'] = recap_df['relative_efficiency'] * 100
            recap_df['absolute_efficiency'] = recap_df['absolute_efficiency'] * 100
            recap_df['participation_rate'] = recap_df['participation_rate'] * 100
            # Round for display
            recap_df['relative_efficiency'] = recap_df['relative_efficiency'].round(2)
            recap_df['absolute_efficiency'] = recap_df['absolute_efficiency'].round(2)
            recap_df['participation_rate'] = recap_df['participation_rate'].round(2)
            recap_df['peak_average_gap'] = recap_df['peak_average_gap'].round(2)
            csv_data = recap_df.to_csv(index=False)
        filename = "player_recap.csv"

    return Response(
        csv_data,
        mimetype="text/csv",
        headers={"Content-disposition": f"attachment; filename={filename}"}
    )

@app.route('/reset_db', methods=['POST'])
def reset_db():
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    db_path = os.path.join(backend_dir, "raid_data.db")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    try:
        cursor.execute("DROP TABLE IF EXISTS attempts")
        cursor.execute("""
            CREATE TABLE attempts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                player_name TEXT NOT NULL,
                score INTEGER NOT NULL,
                doll1 TEXT,
                doll2 TEXT,
                doll3 TEXT,
                doll4 TEXT,
                doll5 TEXT,
                date TEXT DEFAULT (DATE('now'))
            )
        """)
        conn.commit()
        return jsonify({"message": "Database reset successful."}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": f"Database reset failed: {str(e)}"}), 500
    finally:
        conn.close()

@app.route('/import_csv', methods=['POST'])
def import_csv():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        df = pd.read_csv(file)
        required_columns = {'player_name', 'score', 'doll1', 'doll2', 'doll3', 'doll4', 'doll5'}
        if not required_columns.issubset(df.columns):
            return jsonify({'error': f'CSV must contain columns: {required_columns}'}), 400

        backend_dir = os.path.dirname(os.path.abspath(__file__))
        db_path = os.path.join(backend_dir, "raid_data.db")
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        imported = 0
        for _, row in df.iterrows():
            cursor.execute("""
                INSERT INTO attempts (player_name, score, doll1, doll2, doll3, doll4, doll5, date)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                row['player_name'],
                int(row['score']),
                row.get('doll1', None),
                row.get('doll2', None),
                row.get('doll3', None),
                row.get('doll4', None),
                row.get('doll5', None),
                row.get('date', None) if 'date' in df.columns else None
            ))
            imported += 1
        conn.commit()
        conn.close()
        return jsonify({'message': f'Imported {imported} attempts from CSV.'})
    except Exception as e:
        return jsonify({'error': f'Failed to import CSV: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True)