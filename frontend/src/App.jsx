import { useState, useRef } from 'react';
import './App.css';

function App() {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (!file.type.startsWith('image/')) {
      setError("Please upload a valid image file.");
      return;
    }
    setError(null);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setPrediction(null);
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setPrediction(null);
    setError(null);
  };

  const triggerUpload = () => {
    inputRef.current.click();
  };

  const analyzeImage = async () => {
    if (!selectedFile) return;
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      // In production, this URL will point to the deployed backend
      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze image. Ensure the backend is running.');
      }

      const data = await response.json();
      setPrediction(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container glass-panel animate-fade-in">
      <header className="header">
        <h1 className="gradient-text">NeuroAI</h1>
        <p>Advanced Brain Tumor MRI Classification</p>
      </header>

      {!previewUrl ? (
        <div 
          className={`upload-area ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={triggerUpload}
        >
          <input 
            ref={inputRef}
            type="file" 
            className="hidden-input" 
            accept="image/*" 
            onChange={handleChange} 
          />
          <div className="upload-content">
            <svg className="upload-icon" viewBox="0 0 24 24">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
            <p className="upload-text">
              <span>Click to upload</span> or drag and drop
            </p>
            <p style={{color: 'var(--text-secondary)', fontSize: '0.85rem'}}>
              Supports JPG, PNG (Max 5MB)
            </p>
          </div>
        </div>
      ) : (
        <div className="preview-container animate-fade-in">
          <img src={previewUrl} alt="MRI Scan" className="preview-image" />
          <button className="remove-btn" onClick={clearFile} aria-label="Remove image">×</button>
        </div>
      )}

      {error && (
        <div style={{color: '#ef4444', marginBottom: '1rem', padding: '0.5rem', background: 'rgba(239,68,68,0.1)', borderRadius: '8px'}}>
          {error}
        </div>
      )}

      <button 
        className="btn-primary" 
        style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem'}}
        onClick={analyzeImage}
        disabled={!selectedFile || isLoading || prediction}
      >
        {isLoading ? <div className="loader"></div> : (prediction ? 'Analysis Complete' : 'Analyze MRI Scan')}
      </button>

      {prediction && (
        <div className="result-container animate-fade-in">
          <h3 className="result-title">Diagnosis</h3>
          <div className="prediction gradient-text">{prediction.prediction}</div>
          
          <div className="confidence-bar-bg">
            <div 
              className="confidence-bar-fill" 
              style={{width: `${prediction.confidence}%`}}
            ></div>
          </div>
          <div className="confidence-text">
            <span>Confidence Score</span>
            <span>{prediction.confidence}%</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
