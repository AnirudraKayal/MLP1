# NeuroScan - Brain Tumor MRI Classification

Hi there! Welcome to my machine learning project, **NeuroScan**. 

I built this project to learn about transfer learning, computer vision, and how to serve PyTorch models through a web application. It takes an MRI scan as input and classifies it into one of four categories (Glioma, Meningioma, Pituitary Tumor, or No Tumor).

## Project Overview

The project is broken down into two main parts:
1. **The Machine Learning Model**: I fine-tuned a ResNet-18 model using PyTorch. By unfreezing the layers and using a step learning rate scheduler, I managed to get the validation accuracy above 90%. 
2. **The Web Dashboard**: I wanted a nice way to interact with the model, so I built a backend API using FastAPI to serve predictions, and a React frontend to allow users to drag-and-drop scans and see the confidence probabilities.

## Tech Stack
* **ML**: PyTorch, torchvision, scikit-learn
* **Backend**: FastAPI, Python
* **Frontend**: React, Vite, CSS

## How to run it locally

If you want to test out the dashboard on your own machine, you'll need to run both the backend and frontend servers.

**1. Start the FastAPI Backend**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```
The backend will run on `http://localhost:8000`.

**2. Start the React Frontend**
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
The frontend will run on `http://localhost:5173`.

## Model Training (Google Colab)

If you're interested in the model training process, or want to see the confusion matrix and classification report, I've included the Jupyter notebook I used. 

You can run it directly in Google Colab (make sure to select the T4 GPU runtime):
[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/AnirudraKayal/MLP1/blob/main/Colab_Training_and_Evaluation.ipynb)

Thanks for checking out my work! Feel free to reach out if you have any questions.
