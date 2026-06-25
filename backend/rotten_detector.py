import cv2
import numpy as np


def get_rotten_percentage(image_path):

    img = cv2.imread(image_path)

    hsv = cv2.cvtColor(
        img,
        cv2.COLOR_BGR2HSV
    )

    lower_dark = np.array(
        [0,0,0]
    )

    upper_dark = np.array(
        [180,255,80]
    )

    mask = cv2.inRange(
        hsv,
        lower_dark,
        upper_dark
    )

    rotten_pixels = np.sum(
        mask > 0
    )

    total_pixels = (
        mask.shape[0] *
        mask.shape[1]
    )

    rotten_percentage = (
        rotten_pixels /
        total_pixels
    ) * 100

    return round(
        rotten_percentage,
        2
    )
