# FruitScan- A Smart Fruit Quality Assessment System

## 🚀Project Overview
FruitScan is an AI-powered Fruit Quality Assessment System that uses Deep Learning and Computer Vision to identify fruits, evaluate freshness, and assess overall quality from uploaded images.

The system can classify fruits, determine whether they are fresh or rotten, assign quality grades, and provide nutritional information. It also includes features such as detection history, analytics visualization, downloadable PDF reports, and audio-based result output.

The project was developed through dataset organization, exploratory data analysis (EDA), image preprocessing, CNN experimentation, and Vision Transformer (ViT) model development. The final deployment utilizes Vision Transformer models integrated with a Flask backend, and an interactive web interface.

***

## ✨Features

- 🍎 **Fruit Classification** – Identifies and classifies fruits from uploaded images.
- 🥬 **Freshness Detection** – Determines whether a fruit is fresh or rotten.
- ⭐ **Quality Grading** – Assigns quality grades based on freshness analysis.
- 🥗 **Nutritional Information** – Displays nutritional details of detected fruits.
- 📊 **Analytics Dashboard** – Visualizes fruit, freshness, and grading statistics.
- 🕒 **Detection History** – Stores and displays previous prediction records.
- 📄 **Downloadable PDF Reports** – Generates reports containing prediction results and insights.
- 🔊 **Audio-Based Result Output** – Provides voice feedback for prediction results.
- 🌐 **Interactive Web Interface** – User-friendly frontend for image upload and result visualization.
- ⚡ **Real-Time Predictions** – Delivers fast and accurate results using Vision Transformer models.

***

## 🛠️Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Python
- Flask
- Flask-CORS

### Deep Learning & Computer Vision
- PyTorch
- Torchvision
- Vision Transformer (ViT)
- Hugging Face Transformers
- PIL (Python Imaging Library)

### Data Processing & Analysis
- NumPy
- Pandas
- Matplotlib
- Seaborn

***

## 📊Dataset Description

The project utilizes two image datasets for fruit quality assessment and classification tasks.

### Fruit Classification Dataset
- Total Images: **30,481**
- Number of Classes: **30 Fruits**
- Used for training and evaluating the fruit identification model.
- Contains images of various fruit categories captured under different conditions to improve model generalization and robustness.

### Freshness Detection Dataset
- Total Images: **24,478**
- Classes: **Fresh** and **Rotten**
- Used for training and evaluating the freshness classification model.
- Includes images with varying lighting conditions, orientations, and quality levels to simulate real-world scenarios.

***

## 🧹Data Preprocessing

Before training, the datasets underwent several preprocessing steps:

- Image resizing to **224 × 224 pixels**
- Image normalization
- Tensor conversion
- Dataset splitting into **Training**, **Validation**, and **Testing** sets

***

## 📈Model Performance Comparison

Different deep learning approaches were explored during the development phase. The final Vision Transformer (ViT) models were selected based on their superior validation performance.

### Fruit Classification Dataset (30 Classes)

| Model | Validation Accuracy |
|--------|--------|
| Basic CNN | 55.69% |
| MobileNetV2 | 88.48% |
| ResNet50 | 91.25% |
| EfficientNetB0 | 90.94% |
| DenseNet121 | 89.73% |
| Vision Transformer (ViT) | 97.70% |

### Freshness Detection Dataset (Fresh vs Rotten)

| Model | Validation Accuracy |
|--------|--------|
| resnet50 | 96.76% |
| Vision Transformer (ViT) | 99.59% |

***

## 🥇Final Model Selection

Based on the validation results, Vision Transformer (ViT) models were selected for deployment due to their higher accuracy and better generalization performance.

***

## 🧠Model Architecture

The FruitScan system utilizes **Vision Transformer (ViT)** models for both fruit classification and freshness detection tasks. Unlike traditional Convolutional Neural Networks (CNNs), Vision Transformers divide an image into smaller patches and process them using a self-attention mechanism. This enables the model to capture both local and global relationships within an image, resulting in improved feature representation and classification performance.

The ViT architecture was selected after experimentation with CNN-based approaches due to its superior validation accuracy and better generalization on both datasets.

### Vision Transformer (ViT) Architecture

<p align="center">
  <img width="600" height="368" alt="image" src="https://github.com/user-attachments/assets/c34c718f-adfb-49a7-9cb4-6101e3c08dac" />
</p>

The Vision Transformer processes images through the following stages:

1. **Input Image**
   - The input image is resized to **224 × 224 pixels**.

2. **Patch Generation**
   - The image is divided into smaller fixed-size patches.
   - Each patch acts similarly to a token in Natural Language Processing (NLP).

3. **Patch Embedding**
   - Each image patch is converted into a numerical vector representation.

4. **Position Embedding**
   - Positional information is added to preserve the spatial arrangement of image patches.

5. **Transformer Encoder**
   - Multiple transformer encoder layers process the patch embeddings.
   - Self-attention mechanisms learn relationships between different image regions.

6. **Classification Head**
   - The final feature representation is passed through a classification layer to generate predictions.

---

### Fruit Classification Model

The Fruit Classification Model is responsible for identifying the fruit category from an uploaded image.

| Attribute | Description |
|------------|------------|
| Architecture | Vision Transformer (ViT) |
| Input Size | 224 × 224 × 3 |
| Number of Classes | 30 |
| Task | Fruit Classification |
| Output | Fruit Category + Confidence Score |

The model analyzes visual characteristics such as shape, texture, color, and patterns to classify the image into one of the 30 fruit categories.

---

### Freshness Detection Model

The Freshness Detection Model determines whether a fruit is fresh or rotten.

| Attribute | Description |
|------------|------------|
| Architecture | Vision Transformer (ViT) |
| Input Size | 224 × 224 × 3 |
| Number of Classes | 2 |
| Classes | Fresh, Rotten |
| Task | Freshness Classification |
| Output | Freshness Label + Confidence Score |

The model learns visual indicators of freshness, including color variations, texture degradation, and surface appearance, to accurately distinguish between fresh and rotten fruits.

---

### Why Vision Transformer (ViT)?

- Captures global image relationships using self-attention.
- Learns richer feature representations than traditional CNNs.
- Demonstrated superior validation performance during experimentation.
- Achieved high classification accuracy on both fruit classification and freshness detection datasets.
- Provides strong generalization across diverse fruit images and conditions.

***

## 🏆Training and Evaluation Results

### Fruit Classification Model

#### Training Performance

<p align="left">
  <img <img width="537" height="82" alt="Screenshot 2026-06-23 035312" src="https://github.com/user-attachments/assets/1b768d84-fc8c-46ab-8cb9-bbe89208e3c3" />
</p>
<p align="left">
  <img width="590" height="250" alt="Screenshot 2026-06-23 033415" src="https://github.com/user-attachments/assets/93dc0fb3-7e38-4c6d-b775-eab105ba6bde" />
</p>

#### Testing Performance

<p align="left">
  <img width="225" height="30" alt="Screenshot 2026-06-23 041406" src="https://github.com/user-attachments/assets/9a67f2ef-77cc-4aed-b207-a1e97cd43880" />
</p>

---

### Freshness Detection Model

#### Training Performance

<p align="left">
  <img width="460" height="80" alt="Screenshot 2026-06-23 033944" src="https://github.com/user-attachments/assets/1f4dac0d-9a1e-4ad2-af1a-0a84465d1dd7" />
</p>
<p align="left">
  <img width="460" height="80" alt="Screenshot 2026-06-23 034104" src="https://github.com/user-attachments/assets/75f44c8b-b088-4547-b18f-b8f460a882e9" />
</p>
<p align="left">
  <img width="460" height="80" alt="Screenshot 2026-06-23 034309" src="https://github.com/user-attachments/assets/daa875ff-ff3d-4c74-8a8e-d10c3724e033" />
</p>
<p align="left">
  <img <img width="460" height="80" alt="Screenshot 2026-06-23 034343" src="https://github.com/user-attachments/assets/477d2274-e1fd-4a92-aeaa-c06a19aebc01" />
</p>
<p align="left">
  <img width="467" height="80" alt="Screenshot 2026-06-23 034425" src="https://github.com/user-attachments/assets/a78bc801-63f5-45d0-a05f-a3a3bb5c1542" />
</p>

#### Testing Performance

<p align="left">
  <img <img width="197" height="47" alt="Screenshot 2026-06-23 034633" src="https://github.com/user-attachments/assets/ec46e47f-190b-4e3c-8fd8-0a6889a538b7" />
</p>

***

## 🔄Project Workflow

```text
Image Input
    │
    ▼
Preprocessing
(Resize, Normalization)
    │
    ▼
Fruit Identification Model
(Vision Transformer)
    │
    ▼
Freshness Detection Model
(Vision Transformer)
    │
    ▼
Quality Assessment
(A / B / C Grade)
    │
    ▼
Nutrition Analysis
    │
    ▼
Final Output
    │
    ├──► Fruit Name
    ├──► Freshness Status
    ├──► Confidence Score
    ├──► Quality Grade
    ├──► Nutritional Information
    ├──► Audio Feedback
    └──► PDF Report
```

***

## 🚀Future Work

The current system provides accurate fruit classification and freshness assessment; however, several enhancements can be implemented in future versions:

- 📱 Develop a mobile application for on-the-go fruit quality assessment.
- 🎥 Enable real-time detection using live camera feeds and video streams.
- 🌍 Expand the fruit classification dataset to support a larger variety of fruits.
- 📈 Improve model performance through larger datasets and advanced training techniques.
- 🥭 Introduce multi-level freshness grading instead of binary Fresh/Rotten classification.
- 🧪 Integrate additional quality parameters such as size, ripeness, color consistency, and defect detection.
- ☁ Deploy the system on cloud platforms for public access and scalability.
- 🌐 Add multilingual support for a wider user base.
- 🛒 Integrate with agricultural supply chains and smart inventory management systems.
- 📊 Provide advanced analytics and predictive insights for farmers, retailers, and consumers.
