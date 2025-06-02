import sqlite3
import os

def get_user_input():
    player_name = input("Enter player name: ").strip()
    score = int(input("Enter score: ").strip())
    dolls = []
    for i in range(1, 6):
        doll = input(f"Enter name of doll {i} (leave blank if none): ").strip()
        dolls.append(doll if doll else None)
    return player_name, score, dolls

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

if __name__ == "__main__":
    player_name, score, dolls = get_user_input()
    add_attempt_to_db(player_name, score, dolls)
    print("Attempt added to database.")