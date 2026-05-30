import os
import torch
import torch.nn as nn
from torchvision import models, transforms
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io

app = FastAPI(title="Brain Tumor MRI Classifier API")

# Allow CORS for local dev and frontend domain
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with the Vercel domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for model and classes
device = torch.device("cpu")
model = None
class_names = []

def load_model():
    global model, class_names
    model_path = os.path.join(os.path.dirname(__file__), "model.pth")
    classes_path = os.path.join(os.path.dirname(__file__), "class_names.txt")
    
    if not os.path.exists(model_path) or not os.path.exists(classes_path):
        print("Model or classes file not found. Ensure training is complete and files are copied to backend/.")
        return

    with open(classes_path, "r") as f:
        class_names = f.read().strip().split(",")

    # Initialize the model structure
    model = models.resnet18(weights=None)
    num_ftrs = model.fc.in_features
    model.fc = nn.Linear(num_ftrs, len(class_names))
    
    # Load weights
    model.load_state_dict(torch.load(model_path, map_location=device))
    model.eval()
    print("Model loaded successfully.")

@app.on_event("startup")
async def startup_event():
    load_model()

# Image transformation to match training
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Brain Tumor Classification API. Send POST requests to /predict."}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if model is None:
        raise HTTPException(status_code=503, detail="Model is not loaded.")
        
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        
        # Preprocess the image
        input_tensor = transform(image)
        input_batch = input_tensor.unsqueeze(0).to(device)

        # Inference
        with torch.no_grad():
            outputs = model(input_batch)
            probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
            confidence, preds = torch.max(probabilities, 0)
            
        predicted_class = class_names[preds.item()]
        confidence_score = confidence.item()
        
        return {
            "prediction": predicted_class,
            "confidence": round(confidence_score * 100, 2)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
