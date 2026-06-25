from flask import request, jsonify
import os
import sqlite3
from nutrition_db import NUTRITION_DB

from predictor import (
    predict_fruit,
    predict_freshness
)

from utils import (
    grade_quality,
)

from rotten_detector import (
    get_rotten_percentage
)

from database import (
    save_detection
)


def register_routes(app):

    @app.route("/")
    def home():
        return jsonify({
            "message": "Backend Running"
        })


    @app.route("/predict", methods=["POST"])
    def predict():

        print("FILES:", request.files)

        file = request.files.get("image")

        print("FILE:", file)

        if file is None:
            return jsonify({
                "error":"No file received"
            }), 400

        import uuid

        ext = file.filename.split(".")[-1]

        os.makedirs(
            "uploads",
            exist_ok=True
        )

        save_path = os.path.join(
            "uploads",
            f"{uuid.uuid4()}.{ext}"
        )

        file.save(save_path)

        print("Saved:", save_path)
        print("Size:", os.path.getsize(save_path))

        fruit, fruit_conf = predict_fruit(save_path)

        freshness, fresh_conf = predict_freshness(save_path)

        if freshness == "Rotten":

            grade = "C"

        else:

            if fresh_conf >= 70:

                grade = "A"

            else:

                grade = "B"

        print("Fruit Confidence:", fruit_conf)
        print("Freshness Confidence:", fresh_conf)
        print("Freshness:", freshness)
        print("Grade:", grade)

        fruit_name = fruit.lower()

        nutrition = NUTRITION_DB.get(
            fruit_name,
            {}
        )

        conn = sqlite3.connect("../detections.db")
        cur = conn.cursor()

        cur.execute("""
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
        fruit_conf,
        fresh_conf
        ))

        conn.commit()

        row_id = cur.lastrowid

        conn.close()

        print("\n------------------")
        print("Fruit:", fruit)
        print("Fruit Confidence:", fruit_conf)

        print("Freshness:", freshness)
        print("Freshness Confidence:", fresh_conf)

        print("Grade:", grade)
        print("------------------\n")

        return jsonify({

            "id": row_id,

            "fruit": fruit,
            "freshness": freshness,
            "fruit_confidence": round(float(fruit_conf),2),
            "grade": grade,
            "nutrition": nutrition

        })


    @app.route("/history")
    def history():
        
        import sqlite3

        conn = sqlite3.connect("../detections.db")
        cur = conn.cursor()

        cur.execute("""
        SELECT *
        FROM detections
        ORDER BY id DESC
        LIMIT 20
        """)

        rows = cur.fetchall()

        conn.close()

        return jsonify(rows)

    @app.route("/analytics")
    def analytics():

        print("ANALYTICS USING:")
        print(os.path.abspath("../detections.db"))

        import sqlite3

        conn = sqlite3.connect("../detections.db")
        cur = conn.cursor()

        # Fruits

        cur.execute("""
        SELECT fruit,
        COUNT(*)
        FROM detections
        GROUP BY fruit
        ORDER BY COUNT(*) DESC
        """)

        fruit_data = cur.fetchall()

        # Freshness

        cur.execute("""
        SELECT freshness,
        COUNT(*)
        FROM detections
        GROUP BY freshness
        """)

        freshness_data = cur.fetchall()

        # Grades

        cur.execute("""
        SELECT grade,
        COUNT(*)
        FROM detections
        GROUP BY grade
        """)

        grade_data = cur.fetchall()

        conn.close()

        return jsonify({

            "fruits": fruit_data,

            "freshness": freshness_data,

            "grades": grade_data

        })
    
    @app.route("/clear_database", methods=["POST"])
    def clear_database():

        print("CLEAR USING:")
        print(os.path.abspath("../detections.db"))

        print("DATABASE CLEARED")

        conn = sqlite3.connect("../detections.db")

        print(os.path.abspath("../detections.db"))

        cur = conn.cursor()

        cur.execute(
            "DELETE FROM detections"
        )

        print("Rows Deleted:", cur.rowcount)

        conn.commit()

        conn.close()

        return jsonify({
            "success":True
        })
    
    @app.route("/delete_detection/<int:id>", methods=["POST"])
    def delete_detection(id):

        conn = sqlite3.connect("../detections.db")
        cur = conn.cursor()

        cur.execute(
            "DELETE FROM detections WHERE id=?",
            (id,)
        )

        conn.commit()
        conn.close()

        return jsonify({
            "success": True
        })