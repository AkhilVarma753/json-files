import { getDatabase } from './connection';
import { STORES } from './schema';
import { HOSTEL_CONFIG } from '../../constants/hostelConfig';

export const getHostelOccupancy = async () => {
  const db = await getDatabase();
  
  try {
    // Get all hostels and students in parallel
    const [hostels, students] = await Promise.all([
      db.getAll(STORES.HOSTELS),
      db.getAll(STORES.STUDENTS)
    ]);
    
    if (!hostels.length) {
      throw new Error('No hostels found in database');
    }
    
    console.log(`Found ${hostels.length} hostels and ${students.length} students`);
    
    const occupancyMap = new Map();

    // Initialize all possible rooms
    hostels.forEach(hostel => {
      for (let floor = 1; floor <= HOSTEL_CONFIG.FLOORS; floor++) {
        for (let room = 1; room <= HOSTEL_CONFIG.ROOMS_PER_FLOOR; room++) {
          const key = `${hostel.id}-${floor}-${room}`;
          occupancyMap.set(key, {
            hostel_id: hostel.id,
            hostel_name: hostel.name,
            floor_number: floor,
            room_number: room,
            occupants: 0
          });
        }
      }
    });

    // Count occupants
    students.forEach(student => {
      const key = `${student.hostel_id}-${student.floor_number}-${student.room_number}`;
      const room = occupancyMap.get(key);
      if (room) {
        room.occupants = Math.min(room.occupants + 1, HOSTEL_CONFIG.MAX_OCCUPANTS);
      } else {
        console.warn(`Invalid room reference found for student: ${student.name}`);
      }
    });

    const occupancyData = Array.from(occupancyMap.values());
    console.log(`Generated occupancy data for ${occupancyData.length} rooms`);
    return occupancyData;
  } catch (error) {
    console.error('Error getting hostel occupancy:', error);
    throw new Error(`Failed to get hostel occupancy: ${error.message}`);
  }
};