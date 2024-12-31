import React from 'react';
import { ROOM_STATUS, STATUS_COLORS } from '../constants/hostelConfig';

const RoomLegend = () => {
  const legendItems = [
    { status: ROOM_STATUS.EMPTY, label: 'Empty Room' },
    { status: ROOM_STATUS.PARTIAL, label: 'One Student' },
    { status: ROOM_STATUS.FULL, label: 'Two Students (Full)' }
  ];

  return (
    <div className="flex gap-6 p-4 bg-white rounded-lg shadow-sm">
      {legendItems.map(({ status, label }) => (
        <div key={status} className="flex items-center">
          <div 
            className="w-4 h-4 mr-2 rounded"
            style={{ backgroundColor: STATUS_COLORS[status] }}
          />
          <span className="text-sm text-gray-600">{label}</span>
        </div>
      ))}
    </div>
  );
};

export default RoomLegend;