import { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const inputRef = useRef(null);

  // Generate mock patient data on load
  useEffect(() => {
    const generatePatientID = () => `PT-${Math.floor(10000 + Math.random() * 90000)}`;
    const today = new Date().toISOString().split('T')[0];
    setPatientData({
      id: generatePatientID(),
      date: today,
      scanner: 'Siemens MAGNETOM 3T',
      protocol: 'T1/T2 FLAIR Coronal'
    });
  }, []);

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
    setAnalysis(null);
  };

  const clearFile = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    setPreviewUrl(null);
    setAnalysis(null);
    setError(null);
  };

  const triggerUpload = () => {
    if (!selectedFile) inputRef.current.click();
  };

  const analyzeImage = async () => {
    if (!selectedFile) return;
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Analysis engine unavailable. Ensure backend is running.');
      }

      const data = await response.json();
      // Sort probabilities descending
      if (data.all_probabilities) {
        const sorted = Object.entries(data.all_probabilities)
          .sort(([,a], [,b]) => b - a)
          .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
        data.all_probabilities = sorted;
      }
      setAnalysis(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getGradientForScore = (score) => {
    if (score > 80) return 'linear-gradient(90deg, #ef4444, #f43f5e)';
    if (score > 30) return 'linear-gradient(90deg, #f59e0b, #fbbf24)';
    return 'linear-gradient(90deg, #10b981, #34d399)';
  };

  return (
    <div className="dashboard animate-fade-in">
      <header className="dashboard-header">
        <div className="logo-section">
          <h1 className="gradient-text">NeuroScan</h1>
        </div>
        <div className="header-meta">
          <div className="meta-item">
            <span className="meta-label">System Status</span>
            <span className="meta-value" style={{color: 'var(--success-color)'}}>Online (v2.1)</span>
          </div>
        </div>
      </header>

      <div className="dashboard-grid">
        {/* Left Panel: Imaging Input */}
        <section className="panel">
          <h2 className="panel-title">
            <svg className="panel-title-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            Medical Imaging Input
          </h2>

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
            
            {!previewUrl ? (
              <>
                <svg width="48" height="48" fill="var(--text-secondary)" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>
                <div style={{textAlign: 'center'}}>
                  <p style={{fontSize: '1.1rem', marginBottom: '0.5rem'}}>Drop MRI dicom or image here</p>
                  <p style={{color: 'var(--accent-color)', fontWeight: 500}}>or click to browse local files</p>
                </div>
              </>
            ) : (
              <div className="preview-container animate-fade-in">
                <img src={previewUrl} alt="MRI Scan" className="preview-image" />
                <button className="btn-icon" onClick={clearFile} aria-label="Remove image">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                </button>
              </div>
            )}
          </div>

          {error && (
            <div style={{marginTop: '1rem', color: '#ef4444', padding: '1rem', background: 'rgba(239,68,68,0.1)', borderRadius: '12px'}}>
              ⚠ {error}
            </div>
          )}

          <button 
            className="btn-primary" 
            style={{marginTop: '1.5rem', height: '54px'}}
            onClick={analyzeImage}
            disabled={!selectedFile || isLoading || analysis}
          >
            {isLoading ? 'Running Diagnostics...' : (analysis ? 'Analysis Complete' : 'Run AI Diagnostics')}
          </button>
        </section>

        {/* Right Panel: Diagnostics */}
        <section className="panel">
          <h2 className="panel-title">
            <svg className="panel-title-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Diagnostic Report
          </h2>

          {isLoading ? (
            <div className="loader-container animate-fade-in">
              <div className="spinner"></div>
              <p style={{color: 'var(--text-secondary)'}}>Neural network analyzing tissue patterns...</p>
            </div>
          ) : analysis ? (
            <div className="animate-fade-in" style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
              
              <div className="diagnosis-hero">
                <div className="diagnosis-label">Primary AI Classification</div>
                <h3 className="diagnosis-result gradient-text">{analysis.prediction}</h3>
              </div>

              <div style={{marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px'}}>
                Probability Distribution
              </div>
              
              <div className="distribution-list">
                {analysis.all_probabilities && Object.entries(analysis.all_probabilities).map(([className, score]) => (
                  <div className="dist-item" key={className}>
                    <div className="dist-header">
                      <span className="dist-name" style={{fontWeight: className === analysis.prediction ? '600' : '400', color: className === analysis.prediction ? 'var(--text-primary)' : 'var(--text-secondary)'}}>
                        {className.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className="dist-score">{score.toFixed(1)}%</span>
                    </div>
                    <div className="dist-bar-bg">
                      <div 
                        className="dist-bar-fill" 
                        style={{
                          width: `${score}%`,
                          background: className === 'notumor' ? getGradientForScore(100 - score) : getGradientForScore(score)
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{marginTop: 'auto'}}>
                <div style={{marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px'}}>
                  Patient Metadata Context
                </div>
                {patientData && (
                  <div className="patient-meta-grid">
                    <div className="meta-data-group">
                      <span className="mdg-label">Patient ID</span>
                      <span className="mdg-value">{patientData.id}</span>
                    </div>
                    <div className="meta-data-group">
                      <span className="mdg-label">Scan Date</span>
                      <span className="mdg-value">{patientData.date}</span>
                    </div>
                    <div className="meta-data-group" style={{gridColumn: '1 / -1'}}>
                      <span className="mdg-label">Equipment</span>
                      <span className="mdg-value" style={{color: 'var(--text-secondary)'}}>{patientData.scanner} — {patientData.protocol}</span>
                    </div>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="empty-state animate-fade-in">
              <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              <p>Awaiting scan input. Upload an MRI to generate a comprehensive diagnostic report.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;
