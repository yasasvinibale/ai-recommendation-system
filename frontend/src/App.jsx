import React, { useState } from 'react';
import UserSelection from './components/UserSelection';
import RecommendationDashboard from './components/RecommendationDashboard';
import { apiService } from './api';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState('unknown');

  React.useEffect(() => {
    // Check API health on app start
    const checkApiHealth = async () => {
      try {
        await apiService.healthCheck();
        setApiStatus('healthy');
      } catch (error) {
        setApiStatus('unhealthy');
        console.error('API Health check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkApiHealth();
  }, []);

  const handleUserSelect = (userId) => {
    setCurrentUser(userId);
  };

  const handleBackToSelection = () => {
    setCurrentUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Starting AI Recommendation System...</p>
        </div>
      </div>
    );
  }

  if (apiStatus === 'unhealthy') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Backend API Unavailable
          </h1>
          <p className="text-gray-600 mb-6">
            Unable to connect to the backend API. Please try again later.
          </p>
          <div className="bg-gray-100 rounded-lg p-4 text-left">
            <p className="font-medium text-gray-900 mb-2">Backend service:</p>
            <code className="text-sm bg-gray-800 text-green-400 p-2 rounded block">
              https://ai-recommendation-system-viv.onrender.com
            </code>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {currentUser ? (
        <RecommendationDashboard
          userId={currentUser}
          onBack={handleBackToSelection}
        />
      ) : (
        <UserSelection onUserSelect={handleUserSelect} />
      )}
    </div>
  );
}

export default App;
