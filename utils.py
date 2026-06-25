from rotten_detector import (
    get_rotten_percentage
)

from nutrition_db import (
    NUTRITION_DB
)


def grade_quality(image_path):

    rotten = get_rotten_percentage(image_path)

    print("ROTTEN % =", rotten)

    if rotten < 10:
        return "A"

    elif rotten < 25:
        return "B"

    else:
        return "C"


def get_nutrition(fruit_name):

    fruit_name = fruit_name.lower().strip()

    return NUTRITION_DB.get(
        fruit_name,
        {
            "message":"No nutrition data found"
        }
    )