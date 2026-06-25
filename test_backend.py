from predictor import predict_fruit
from predictor import predict_freshness

image = "apple.jpg"

print("FRUIT:")
print(
    predict_fruit(image)
)

print()

print("FRESHNESS:")
print(
    predict_freshness(image)
)