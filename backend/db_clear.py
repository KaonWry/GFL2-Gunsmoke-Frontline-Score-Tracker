import sqlite3
import os

def reset_attempts_table(db_name="raid_data.db"):
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    db_path = os.path.join(backend_dir, db_name)
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    # Drop the table if it exists
    cursor.execute("DROP TABLE IF EXISTS attempts;")
    # Recreate the table with the same schema
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
        );
    """)
    conn.commit()
    conn.close()
    print("Table 'attempts' has been resetted.")

if __name__ == "__main__":
    reset_attempts_table()