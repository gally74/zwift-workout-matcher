import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bike, Clock, TrendingUp, MapPin, Star, Info, Upload, FileText, Zap } from 'lucide-react';
import './App.css';

function App() {
  const [workoutData, setWorkoutData] = useState({
    name: '',
    intensity: 'Medium',
    duration: 60,
    focus: '',
    description: ''
  });
  const [matches, setMatches] = useState([]);
  const [reasoning, setReasoning] = useState('');
  const [routes, setRoutes] = useState([]);
  const [workoutTypes, setWorkoutTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [parsedWorkout, setParsedWorkout] = useState(null);
  const [selectedWorld, setSelectedWorld] = useState('All Worlds');
  const [filteredRoutes, setFilteredRoutes] = useState([]);

  useEffect(() => {
    fetchRoutes();
    fetchWorkoutTypes();
  }, []);

  useEffect(() => {
    if (selectedWorld === 'All Worlds') {
      setFilteredRoutes(routes);
    } else {
      setFilteredRoutes(routes.filter(route => route.world === selectedWorld));
    }
  }, [selectedWorld, routes]);

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
      setWorkoutTypes(response.data);
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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.zwo')) {
      alert('Please select a valid ZWO file');
      return;
    }

    setUploadedFile(file);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('zwoFile', file);

      const response = await axios.post('/api/upload-zwo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setParsedWorkout(response.data.workout);
      setMatches(response.data.matches);
      setReasoning(response.data.reasoning);
      
      // Update form with parsed data
      setWorkoutData({
        name: response.data.workout.name,
        intensity: response.data.workout.intensity,
        duration: Math.round(response.data.workout.totalDuration / 60),
        focus: response.data.workout.focus,
        description: response.data.workout.description
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error processing ZWO file: ' + error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post('/api/match-workout', {
        workoutData: workoutData
      });
      
      setMatches(response.data.matches);
      setReasoning(response.data.reasoning);
    } catch (error) {
      console.error('Error matching workout:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectWorkoutType = (workoutType) => {
    setWorkoutData({
      name: workoutType.name,
      intensity: workoutType.intensity,
      duration: parseInt(workoutType.duration.split('-')[0]),
      focus: workoutType.focus,
      description: workoutType.focus
    });
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const worlds = ['All Worlds', ...new Set(routes.map(route => route.world))];

  return (
    <div className="App">
      <header className="header">
        <div className="header-content">
          <Bike className="header-icon" />
          <h1>Zwift Workout Route Matcher</h1>
          <p>AI-powered matching of Xert ZWO files with perfect Zwift routes</p>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          <div className="input-section">
            <h2>Upload Xert ZWO File</h2>
            
            <div className="upload-section">
              <div className="upload-area">
                <Upload className="upload-icon" />
                <h3>Upload your Xert ZWO file</h3>
                <p>Drag and drop your .zwo file here, or click to browse</p>
                <input
                  type="file"
                  accept=".zwo"
                  onChange={handleFileUpload}
                  className="file-input"
                  id="zwoFile"
                />
                <label htmlFor="zwoFile" className="upload-button">
                  Choose ZWO File
                </label>
              </div>
              
              {uploadedFile && (
                <div className="file-info">
                  <FileText className="file-icon" />
                  <span>{uploadedFile.name}</span>
                </div>
              )}
            </div>

            {parsedWorkout && (
              <div className="parsed-workout">
                <h3>Parsed Workout Data</h3>
                <div className="workout-details">
                  <div className="detail-row">
                    <strong>Name:</strong> {parsedWorkout.name}
                  </div>
                  <div className="detail-row">
                    <strong>Duration:</strong> {formatDuration(parsedWorkout.totalDuration)}
                  </div>
                  <div className="detail-row">
                    <strong>Intensity:</strong> {parsedWorkout.intensity}
                  </div>
                  <div className="detail-row">
                    <strong>Focus:</strong> {parsedWorkout.focus}
                  </div>
                  <div className="detail-row">
                    <strong>Intervals:</strong> {parsedWorkout.intervals.length}
                  </div>
                  <div className="detail-row">
                    <strong>Features:</strong> {parsedWorkout.features.join(', ')}
                  </div>
                </div>
              </div>
            )}

            <div className="divider">
              <span>OR</span>
            </div>

            <h2>Manual Workout Entry</h2>
            
            {/* World Filter */}
            <div className="world-filter">
              <h3>Filter by World</h3>
              <select 
                value={selectedWorld} 
                onChange={(e) => setSelectedWorld(e.target.value)}
                className="world-select"
              >
                {worlds.map(world => (
                  <option key={world} value={world}>{world}</option>
                ))}
              </select>
            </div>

            {/* Quick Select Workout Types */}
            <div className="workout-types">
              <h3>Quick Select Workout Types</h3>
              <div className="workout-type-grid">
                {workoutTypes.map((type, index) => (
                  <button
                    key={index}
                    className="workout-type-card"
                    onClick={() => selectWorkoutType(type)}
                  >
                    <h4>{type.name}</h4>
                    <p><TrendingUp /> {type.intensity}</p>
                    <p><Clock /> {type.duration}</p>
                    <p>{type.focus}</p>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="workout-form">
              <div className="form-group">
                <label htmlFor="name">Workout Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={workoutData.name}
                  onChange={handleInputChange}
                  placeholder="Enter workout name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="intensity">Intensity Level:</label>
                <select
                  id="intensity"
                  name="intensity"
                  value={workoutData.intensity}
                  onChange={handleInputChange}
                >
                  <option value="Low">Low (Recovery)</option>
                  <option value="Medium">Medium (Endurance)</option>
                  <option value="High">High (Threshold)</option>
                  <option value="Very High">Very High (VO2 Max)</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="duration">Duration (minutes):</label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={workoutData.duration}
                  onChange={handleInputChange}
                  min="15"
                  max="300"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="focus">Workout Focus:</label>
                <input
                  type="text"
                  id="focus"
                  name="focus"
                  value={workoutData.focus}
                  onChange={handleInputChange}
                  placeholder="e.g., Climbing, Intervals, Sweet Spot"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description:</label>
                <textarea
                  id="description"
                  name="description"
                  value={workoutData.description}
                  onChange={handleInputChange}
                  placeholder="Additional workout details..."
                  rows="3"
                />
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Finding Routes...' : 'Find Matching Routes'}
              </button>
            </form>
          </div>

          {matches.length > 0 && (
            <div className="results-section">
              <h2>AI Route Recommendations</h2>
              <div className="reasoning">
                <Zap className="ai-icon" />
                <p>{reasoning}</p>
              </div>
              
              <div className="matches-grid">
                {matches.map((match, index) => (
                  <div key={index} className="match-card">
                    <div className="match-header">
                      <h3>{match.route.name}</h3>
                      <div className="score">
                        <Star className="star-icon" />
                        <span>{match.score}/1.0</span>
                      </div>
                    </div>
                    
                    <div className="route-details">
                      <div className="detail">
                        <MapPin />
                        <span>{match.route.distance} km</span>
                      </div>
                      <div className="detail">
                        <TrendingUp />
                        <span>{match.route.elevation}m elevation</span>
                      </div>
                      <div className="detail">
                        <Clock />
                        <span>~{match.estimatedTime} min</span>
                      </div>
                    </div>
                    
                    <div className="route-info">
                      <p><strong>World:</strong> {match.route.world}</p>
                      <p><strong>Difficulty:</strong> {match.route.difficulty}</p>
                      <p><strong>Terrain:</strong> {match.route.terrain}</p>
                      <p><strong>Category:</strong> {match.route.category}</p>
                    </div>
                    
                    <p className="route-description">{match.route.description}</p>
                    
                    <div className="ai-analysis">
                      <h4>AI Analysis Breakdown:</h4>
                      <div className="analysis-bars">
                        <div className="analysis-bar">
                          <span>Intensity</span>
                          <div className="bar">
                            <div 
                              className="bar-fill" 
                              style={{width: `${match.aiAnalysis.intensityMatch * 100}%`}}
                            ></div>
                          </div>
                          <span>{Math.round(match.aiAnalysis.intensityMatch * 100)}%</span>
                        </div>
                        <div className="analysis-bar">
                          <span>Duration</span>
                          <div className="bar">
                            <div 
                              className="bar-fill" 
                              style={{width: `${match.aiAnalysis.durationMatch * 100}%`}}
                            ></div>
                          </div>
                          <span>{Math.round(match.aiAnalysis.durationMatch * 100)}%</span>
                        </div>
                        <div className="analysis-bar">
                          <span>Features</span>
                          <div className="bar">
                            <div 
                              className="bar-fill" 
                              style={{width: `${match.aiAnalysis.featureMatch * 100}%`}}
                            ></div>
                          </div>
                          <span>{Math.round(match.aiAnalysis.featureMatch * 100)}%</span>
                        </div>
                        <div className="analysis-bar">
                          <span>Focus</span>
                          <div className="bar">
                            <div 
                              className="bar-fill" 
                              style={{width: `${match.aiAnalysis.focusMatch * 100}%`}}
                            ></div>
                          </div>
                          <span>{Math.round(match.aiAnalysis.focusMatch * 100)}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="match-reasons">
                      <h4>Why this route matches:</h4>
                      <ul>
                        {match.reasons.slice(0, 4).map((reason, idx) => (
                          <li key={idx}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App; 