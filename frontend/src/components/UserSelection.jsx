import React, { useState, useEffect } from 'react';
import { User, Search, ArrowRight } from 'lucide-react';
import { apiService } from '../api';

const UserSelection = ({ onUserSelect }) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiService.getUsers();
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load users');
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedUserId) {
      onUserSelect(parseInt(selectedUserId));
    }
  };

  const filteredUsers = users.filter(user => 
    user.toString().includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Recommendation System
          </h1>
          <p className="text-gray-600">
            Get personalized product recommendations powered by AI
          </p>
        </div>

        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="user-select" className="block text-sm font-medium text-gray-700 mb-2">
                Select Your Profile
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="user-select"
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="input-field pl-10 appearance-none cursor-pointer"
                  required
                >
                  <option value="">Choose a user profile...</option>
                  {loading ? (
                    <option>Loading users...</option>
                  ) : (
                    filteredUsers.map((user) => (
                      <option key={user} value={user}>
                        User {user}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="user-search" className="block text-sm font-medium text-gray-700 mb-2">
                Or search by User ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="user-search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Enter User ID..."
                  className="input-field pl-10"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!selectedUserId || loading}
              className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Get My Recommendations</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center text-sm text-gray-600">
              <p className="mb-2">
                <strong>How it works:</strong>
              </p>
              <ul className="text-left space-y-1">
                <li>• Select your user profile</li>
                <li>• Get AI-powered recommendations</li>
                <li>• Discover products you'll love</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Powered by Machine Learning Algorithms
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserSelection;
