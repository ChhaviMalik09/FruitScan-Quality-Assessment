import os
import sqlite3

DB_NAME = "../detections.db"
print("DATABASE.PY USING:")
print(os.path.abspath(DB_NAME))

def save_detection(
    fruit,
    freshness,
    grade,
    fruit_confidence,
    freshness_confidence
):

    conn = sqlite3.connect(DB_NAME)

    cur = conn.cursor()

    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS detections(

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            fruit TEXT,

            freshness TEXT,

            grade TEXT,

            fruit_confidence REAL,

            freshness_confidence REAL,

            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP

        )
        """
        
    )

    cur.execute(
        """
        INSERT INTO detections(

            fruit,
            freshness,
            grade,
            fruit_confidence,
            freshness_confidence

        )

        VALUES(?,?,?,?,?)
        """,

        (
            fruit,
            freshness,
            grade,
            fruit_confidence,
            freshness_confidence
        )
    )

    conn.commit()

    conn.close()
