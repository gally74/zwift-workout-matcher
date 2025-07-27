import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [routes, setRoutes] = useState([]);
  const [workoutTypes, setWorkoutTypes] = useState([]);
  const [matchedRoutes, setMatchedRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [parsedWorkout, setParsedWorkout] = useState(null);
  const [workoutData, setWorkoutData] = useState({
    name: '',
    duration: '',
    intensity: 'medium',
    focus: '',
    features: []
  });
  
  // New states for FTP and Weight
  const [ftp, setFtp] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [wkg, setWkg] = useState(null);
  const [matchingMethod, setMatchingMethod] = useState('');
  const [ftpUsed, setFtpUsed] = useState(null);

  useEffect(() => {
    fetchRoutes();
    fetchWorkoutTypes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await axios.get('/api/routes');
      setRoutes(response.data);
    } catch (error) {
      console.error('Error fetching routes:', error);
    }
  };

  const fetchWorkoutTypes = async () => {
    try {
      const response = await axios.get('/api/workout-types');
      setWorkoutTypes(response.data || []);
    } catch (error) {
      console.error('Error fetching workout types:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setWorkoutData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFtpChange = (e) => {
    setFtp(e.target.value);
    if (e.target.value && weightKg) {
      setWkg((parseFloat(e.target.value) / parseFloat(weightKg)).toFixed(2));
    } else {
      setWkg(null);
    }
  };

  const handleWeightChange = (e) => {
    setWeightKg(e.target.value);
    if (ftp && e.target.value) {
      setWkg((parseFloat(ftp) / parseFloat(e.target.value)).toFixed(2));
    } else {
      setWkg(null);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setUploadedFile(file);

    const formData = new FormData();
    formData.append('zwoFile', file);
    formData.append('ftp', ftp);
    formData.append('weightKg', weightKg);

    try {
      const response = await axios.post('/api/upload-zwo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setMatchedRoutes(response.data.matches || []);
      setParsedWorkout(response.data.workout || {});
      setWorkoutData(response.data.workout || {});
      setWkg(response.data.wkg);
      setMatchingMethod(response.data.matchingMethod);
      setFtpUsed(response.data.ftpUsed);
      setLoading(false);
    } catch (error) {
      console.error('Error uploading file:', error);
      setLoading(false);
      alert('Error uploading file: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/match-workout', {
        workoutData,
        ftp,
        weightKg
      });

      setMatchedRoutes(response.data.matches || []);
      setWkg(response.data.wkg);
      setMatchingMethod(response.data.matchingMethod);
      setFtpUsed(response.data.ftpUsed);
      setLoading(false);
    } catch (error) {
      console.error('Error matching workout:', error);
      setLoading(false);
      alert('Error matching workout: ' + (error.response?.data?.error || error.message));
    }
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
  };

  const formatPower = (power) => {
    return `${power}% FTP`;
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="brand-logos">
              <div className="zwift-logo">
                <span className="zwift-text">ZWIFT</span>
                <div className="zwift-icon">🚴</div>
              </div>
              <div className="logo-separator">×</div>
              <div className="xert-logo">
                <span className="xert-text">XERT</span>
                <div className="xert-icon">⚡</div>
              </div>
            </div>
            <h1>Workout Route Matcher</h1>
          </div>
          <p className="tagline">Match your Xert workouts to perfect Zwift routes</p>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          {/* Step 1: FTP & Weight Input */}
          <section className="input-section">
            <div className="section-header">
              <div className="step-number">1</div>
              <h2>Enter Your Power Data</h2>
              <p>This helps us calculate your w/kg and match routes to your fitness level</p>
            </div>
            
            <div className="power-inputs">
              <div className="input-group">
                <label htmlFor="ftp">FTP (Watts)</label>
                <input
                  type="number"
                  id="ftp"
                  value={ftp}
                  onChange={handleFtpChange}
                  placeholder="e.g., 250"
                  min="0"
                />
              </div>
              
              <div className="input-group">
                <label htmlFor="weightKg">Weight (kg)</label>
                <input
                  type="number"
                  id="weightKg"
                  value={weightKg}
                  onChange={handleWeightChange}
                  placeholder="e.g., 70"
                  min="0"
                  step="0.1"
                />
              </div>
              
              {wkg && (
                <div className="wkg-display">
                  <span>Your w/kg: <strong>{wkg}</strong></span>
                </div>
              )}
            </div>
          </section>

          {/* Step 2: ZWO File Upload */}
          <section className="input-section">
            <div className="section-header">
              <div className="step-number">2</div>
              <h2>Upload Your Xert ZWO File</h2>
              <p>Upload your workout file to get precise route matches</p>
            </div>
            
            <div className="file-upload-area">
              <div className="upload-zone">
                <div className="upload-icon">📁</div>
                <p>Drag and drop your .zwo file here, or click to browse</p>
                <input
                  type="file"
                  accept=".zwo"
                  onChange={handleFileUpload}
                  id="zwoFile"
                  className="file-input"
                />
                <label htmlFor="zwoFile" className="upload-button">
                  Choose ZWO File
                </label>
              </div>
              
              {uploadedFile && (
                <div className="uploaded-file">
                  <span className="file-icon">✅</span>
                  <span className="file-name">{uploadedFile.name}</span>
                </div>
              )}
            </div>
          </section>

          {/* Parsed Workout Details */}
          {parsedWorkout && (
            <section className="workout-details-section">
              <div className="section-header">
                <div className="step-number">📊</div>
                <h2>Workout Analysis</h2>
                <p>Detailed breakdown of your uploaded workout</p>
              </div>
              
              <div className="workout-details">
                <div className="workout-overview">
                  <div className="workout-header">
                    <h3>{parsedWorkout.name || 'Unknown Workout'}</h3>
                    {parsedWorkout.author && (
                      <div className="workout-author">by {parsedWorkout.author}</div>
                    )}
                  </div>
                  
                  <div className="workout-stats">
                    <div className="stat-card">
                      <div className="stat-label">Total Duration</div>
                      <div className="stat-value">{formatDuration(parsedWorkout.totalDuration || 0)}</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-label">Intensity</div>
                      <div className="stat-value">{parsedWorkout.intensity || 'Unknown'}</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-label">Focus</div>
                      <div className="stat-value">{parsedWorkout.focus || 'Not specified'}</div>
                    </div>
                    {parsedWorkout.ftpOverride && (
                      <div className="stat-card">
                        <div className="stat-label">FTP Override</div>
                        <div className="stat-value">{parsedWorkout.ftpOverride}W</div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="workout-intervals">
                  <h4>Interval Breakdown</h4>
                  <div className="intervals-grid">
                    {parsedWorkout.intervals && parsedWorkout.intervals.map((interval, index) => (
                      <div key={index} className="interval-card">
                        <div className="interval-header">
                          <span className="interval-number">#{index + 1}</span>
                          <span className="interval-type">{interval.type || 'Interval'}</span>
                        </div>
                        <div className="interval-details">
                          <div className="interval-stat">
                            <span className="label">Duration:</span>
                            <span className="value">{formatDuration(interval.duration || 0)}</span>
                          </div>
                          <div className="interval-stat">
                            <span className="label">Power:</span>
                            <span className="value">{formatPower(interval.power || 0)}</span>
                          </div>
                          <div className="interval-stat">
                            <span className="label">Intensity:</span>
                            <span className="value">{Math.round((interval.intensity || 0) * 100)}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {parsedWorkout.features && parsedWorkout.features.length > 0 && (
                  <div className="workout-features">
                    <h4>Workout Features</h4>
                    <div className="features-tags">
                      {parsedWorkout.features.map((feature, index) => (
                        <span key={index} className="feature-tag">{feature}</span>
                      ))}
                    </div>
                  </div>
                )}
                
                {parsedWorkout.description && (
                  <div className="workout-description">
                    <h4>Description</h4>
                    <p>{parsedWorkout.description}</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Step 3: Manual Entry (Alternative) */}
          <section className="input-section">
            <div className="section-header">
              <div className="step-number">3</div>
              <h2>Manual Workout Entry (Alternative)</h2>
              <p>Or manually enter workout details if you don't have a ZWO file</p>
            </div>
            
            <form onSubmit={handleSubmit} className="workout-form">
              <div className="form-row">
                <div className="input-group">
                  <label htmlFor="name">Workout Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={workoutData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Sweet Spot Training"
                  />
                </div>
                
                <div className="input-group">
                  <label htmlFor="duration">Duration (minutes)</label>
                  <input
                    type="number"
                    id="duration"
                    name="duration"
                    value={workoutData.duration}
                    onChange={handleInputChange}
                    placeholder="e.g., 60"
                    min="0"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="input-group">
                  <label htmlFor="intensity">Intensity</label>
                  <select
                    id="intensity"
                    name="intensity"
                    value={workoutData.intensity}
                    onChange={handleInputChange}
                  >
                    <option value="recovery">Recovery</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                    <option value="very_hard">Very Hard</option>
                  </select>
                </div>
                
                <div className="input-group">
                  <label htmlFor="focus">Focus</label>
                  <select
                    id="focus"
                    name="focus"
                    value={workoutData.focus}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Focus</option>
                    <option value="endurance">Endurance</option>
                    <option value="threshold">Threshold</option>
                    <option value="vo2_max">VO2 Max</option>
                    <option value="sweet_spot">Sweet Spot</option>
                    <option value="recovery">Recovery</option>
                  </select>
                </div>
              </div>
              
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? 'Finding Routes...' : 'Find Matching Routes'}
              </button>
            </form>
          </section>

          {/* Quick Select Workout Types */}
          {workoutTypes.length > 0 && (
            <section className="quick-select-section">
              <h3>Quick Select Workout Types</h3>
              <div className="workout-types-grid">
                {workoutTypes.map((type, index) => (
                  <button
                    key={index}
                    className="workout-type-button"
                    onClick={() => {
                      setWorkoutData({
                        name: type.name,
                        duration: type.duration,
                        intensity: type.intensity,
                        focus: type.focus,
                        features: type.features || []
                      });
                    }}
                  >
                    <div className="workout-type-name">{type.name}</div>
                    <div className="workout-type-details">
                      {type.duration}min • {type.intensity}
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Results Section */}
          {matchedRoutes.length > 0 && (
            <section className="results-section">
              <div className="results-header">
                <h2>Recommended Routes</h2>
                {wkg && <div className="wkg-info">w/kg: {wkg}</div>}
                {ftpUsed && <div className="ftp-info">FTP Used: {ftpUsed}W</div>}
                {matchingMethod && <div className="method-info">Method: {matchingMethod}</div>}
              </div>
              
              <div className="routes-grid">
                {matchedRoutes.map((match, index) => (
                  <div key={index} className="route-card">
                    <div className="route-header">
                      <h3 className="route-name">{match.route?.name || 'Unknown Route'}</h3>
                      <div className="route-score">{(match.score * 100).toFixed(0)}% Match</div>
                    </div>
                    
                    <div className="route-details">
                      <div className="route-info">
                        <span className="world">{match.route?.world || 'Unknown World'}</span>
                        <span className="category">{match.route?.category || 'Unknown Category'}</span>
                      </div>
                      
                      <div className="route-stats">
                        <div className="stat">
                          <span className="label">Distance:</span>
                          <span className="value">{match.route?.distance || 0} km</span>
                        </div>
                        <div className="stat">
                          <span className="label">Elevation:</span>
                          <span className="value">{match.route?.elevation || 0} m</span>
                        </div>
                        <div className="stat">
                          <span className="label">Est. Time:</span>
                          <span className="value">{formatDuration((match.estimatedTime || 0) * 60)}</span>
                        </div>
                        <div className="stat">
                          <span className="label">Badge XP:</span>
                          <span className="value">{match.route?.badgeXP || 0}</span>
                        </div>
                      </div>
                      
                      {match.reasons && match.reasons.length > 0 && (
                        <div className="match-reasons">
                          <strong>Why this route:</strong>
                          <ul>
                            {match.reasons.map((reason, idx) => (
                              <li key={idx}>{reason}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Loading State */}
          {loading && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
              <p>Finding the perfect routes for your workout...</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer with Buy Me a Coffee */}
      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Zwift Workout Route Matcher</h3>
            <p>Match your Xert workouts to perfect Zwift routes</p>
          </div>
          
          <div className="footer-section">
            <h4>Support the Project</h4>
            <p>If this tool helps your training, consider buying me a coffee!</p>
            <div className="coffee-buttons">
              <a 
                href="https://coff.ee/roygalvin" 
                target="_blank" 
                rel="noopener noreferrer"
                className="coffee-button"
              >
                ☕ Buy Me a Coffee
              </a>
              <a 
                href="https://ko-fi.com/yourusername" 
                target="_blank" 
                rel="noopener noreferrer"
                className="kofi-button"
              >
                🎨 Support on Ko-fi
              </a>
            </div>
          </div>
          
          <div className="footer-section">
            <h4>Share</h4>
            <p>Share this tool with other Zwift riders!</p>
            <div className="share-buttons">
              <button 
                onClick={() => navigator.share({ 
                  title: 'Zwift Workout Route Matcher', 
                  text: 'Match your Xert workouts to perfect Zwift routes!', 
                  url: window.location.href 
                })}
                className="share-button"
              >
                📤 Share
              </button>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 Zwift Workout Route Matcher. Made with ❤️ for the cycling community.</p>
        </div>
      </footer>
    </div>
  );
}

export default App; 