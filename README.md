<div align="center">
  
  # 🧠 NeuroScan
  **An Advanced Brain Tumor MRI Classification Dashboard powered by Deep Learning**

  [![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)](https://pytorch.org/)
  [![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

</div>

---

## 🚀 Overview

NeuroScan is an end-to-end Machine Learning web application designed to assist in the diagnosis of brain tumors from MRI scans. Utilizing **Transfer Learning** on a state-of-the-art **ResNet-18** deep convolutional neural network, the model classifies MRI scans into four categories with **>90% validation accuracy**:
- **Glioma**
- **Meningioma**
- **Pituitary Tumor**
- **No Tumor**

This project demonstrates a complete, production-ready AI pipeline: from data ingestion and deep learning model training (in Google Colab) to backend API deployment and a stunning, data-rich React frontend.

---

## ✨ Features

- **High-Accuracy ML Model**: Fine-tuned PyTorch ResNet-18 model utilizing advanced learning rate scheduling and weight decay.
- **Lightning-fast API**: A RESTful Python backend built with FastAPI that loads the PyTorch tensors directly into memory for near-instant inference.
- **Premium Dashboard UI**: A breathtaking, responsive React frontend built with Vite. Features dark mode, glassmorphism aesthetics, drag-and-drop file uploads, and a dynamic confidence probability distribution panel.
- **Jupyter/Colab Integration**: Includes a fully automated Google Colab notebook (`Colab_Training_and_Evaluation.ipynb`) for 1-click model training, evaluation, and confusion matrix generation on a free T4 GPU.

---

## 🏗️ Architecture

```mermaid
graph LR
    A[React/Vite Frontend] -- Uploads MRI Image via HTTP POST --> B[FastAPI Backend]
    B -- Preprocesses Image --> C[PyTorch ResNet-18 Model]
    C -- Returns Confidence Scores --> B
    B -- JSON Response --> A
```

---

## 💻 Quick Start (Run Locally)

### 1. Start the FastAPI Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```
*The backend will be live at `http://localhost:8000`*

### 2. Start the React Frontend
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
*The beautiful UI will be live at `http://localhost:5173`*

---

## 🔬 Model Training

If you wish to train the model yourself or view the evaluation metrics (Classification Report, Confusion Matrix), simply open the included Colab notebook:

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/AnirudraKayal/MLP1/blob/main/Colab_Training_and_Evaluation.ipynb)

---

<div align="center">
  <b>Built for clinical speed. Designed for human precision.</b>
</div>
