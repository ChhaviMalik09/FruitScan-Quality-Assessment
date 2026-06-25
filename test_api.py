import requests

response = requests.post(
    "http://127.0.0.1:5000/predict_fruit",
    json={"image":"test"}
)

print(response.status_code)
print(response.text)