import torch
from torchvision import transforms
from transformers import ViTForImageClassification

import transformers

print("TRANSFORMERS VERSION:")
print(transformers.__version__)

device = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

transform = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.5,0.5,0.5],
        std=[0.5,0.5,0.5]
    )
])

# -------------------------
# FRUIT MODEL
# -------------------------

fruit_model = ViTForImageClassification.from_pretrained(
    "google/vit-base-patch16-224",
    num_labels=30,
    ignore_mismatched_sizes=True
)

fruit_model.load_state_dict(
    torch.load(
        "../models/Fruit30/Fruit30_ViT_FineTuned.pth",
        map_location=device
    ),
    strict=False
)

fruit_model.to(device)
fruit_model.eval()

# -------------------------
# FRESHNESS MODEL
# -------------------------

freshness_model = ViTForImageClassification.from_pretrained(
    "../models/Freshness10_Model",
    local_files_only=True
)

freshness_model.to(device)
freshness_model.eval()

