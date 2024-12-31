import React, { useEffect, useState } from 'react';
import { initializeDatabase } from './utils/database/index.js';
import { seedDatabase } from './utils/seedData';
import Dashboard from './components/Dashboard';

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        console.log('Initializing database...');
        await initializeDatabase();
        console.log('Database initialized, seeding data...');
        await seedDatabase();
        console.log('Setup complete');
        setIsInitialized(true);
      } catch (err) {
        console.error('Setup failed:', err);
        setError(err.message);
      }
    };
    init();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Initializing...</h2>
          <p className="text-gray-600">Setting up the hostel management system</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Dashboard />
    </div>
  );
}

export default App;