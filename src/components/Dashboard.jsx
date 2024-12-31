import React, { useState, useEffect } from 'react';
import { getHostelOccupancy } from '../utils/database/index.js';
import HostelBlock from './HostelBlock';
import RoomLegend from './RoomLegend';

const Dashboard = () => {
  const [hostelData, setHostelData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching hostel occupancy data...');
        const data = await getHostelOccupancy();
        console.log('Raw occupancy data:', data);
        
        // Group data by hostel
        const groupedData = data.reduce((acc, curr) => {
          const hostelId = curr.hostel_id;
          if (!acc[hostelId]) {
            acc[hostelId] = {
              name: curr.hostel_name,
              data: []
            };
          }
          acc[hostelId].data.push(curr);
          return acc;
        }, {});
        
        console.log('Grouped hostel data:', groupedData);
        setHostelData(groupedData);
      } catch (error) {
        console.error('Error fetching hostel data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Data</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading hostel data...</h2>
          <p className="text-gray-600">Please wait while we fetch the latest information</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Hostel Management Dashboard
        </h1>
        <p className="text-gray-600">
          Real-time overview of room occupancy across all hostel blocks
        </p>
      </div>

      <div className="mb-6">
        <RoomLegend />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {Object.entries(hostelData).map(([hostelId, hostel]) => (
          <div key={hostelId} className="flex-1">
            <HostelBlock 
              data={hostel.data} 
              hostelName={hostel.name}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;