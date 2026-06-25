from PIL import Image

import torch

from model_loader import (
    fruit_model,
    freshness_model,
    transform,
    device
)

from classes import (
    fruit_classes,
    freshness_classes
)


def predict_fruit(image_path):

    image = Image.open(
        image_path
    ).convert("RGB")

    image = transform(image)

    image = image.unsqueeze(0)

    image = image.to(device)

    with torch.no_grad():

        output = fruit_model(image)

        probs = torch.softmax(
            output.logits,
            dim=1
        )

        conf,pred = torch.max(
            probs,
            dim=1
        )

    return (
        fruit_classes[pred.item()],
        round(conf.item()*100,2)
    )


def predict_freshness(image_path):

    image = Image.open(
        image_path
    ).convert("RGB")

    image = transform(image)

    image = image.unsqueeze(0)

    image = image.to(device)

    with torch.no_grad():

        output = freshness_model(image)

        probs = torch.softmax(
            output.logits,
            dim=1
        )

        conf,pred = torch.max(
            probs,
            dim=1
        )

    return (
        freshness_classes[pred.item()],
        round(conf.item()*100,2)
    )
