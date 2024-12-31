import { getDatabase } from './connection';
import { STORES, INDICES } from './schema';
import { HOSTEL_CONFIG } from '../../constants/hostelConfig';

export const addStudent = async (name, hostelId, floorNumber, roomNumber) => {
  const db = await getDatabase();
  const tx = db.transaction([STORES.STUDENTS, STORES.HOSTELS], 'readwrite');
  
  try {
    // Validate hostel exists
    const hostelStore = tx.objectStore(STORES.HOSTELS);
    const hostel = await hostelStore.get(hostelId);
    if (!hostel) {
      throw new Error(`Invalid hostel ID: ${hostelId}`);
    }

    // Validate floor and room numbers
    if (floorNumber < 1 || floorNumber > HOSTEL_CONFIG.FLOORS) {
      throw new Error(`Invalid floor number: ${floorNumber}`);
    }
    if (roomNumber < 1 || roomNumber > HOSTEL_CONFIG.ROOMS_PER_FLOOR) {
      throw new Error(`Invalid room number: ${roomNumber}`);
    }

    const studentStore = tx.objectStore(STORES.STUDENTS);
    const index = studentStore.index(INDICES.HOSTEL_ROOM);
    const occupants = await index.getAll([hostelId, floorNumber, roomNumber]);
    
    if (occupants.length >= HOSTEL_CONFIG.MAX_OCCUPANTS) {
      throw new Error(`Room ${roomNumber} on floor ${floorNumber} in ${hostel.name} is at maximum capacity`);
    }

    await studentStore.add({
      name,
      hostel_id: hostelId,
      floor_number: floorNumber,
      room_number: roomNumber,
      admission_date: new Date().toISOString()
    });

    await tx.done;
    console.log(`Successfully added student ${name} to ${hostel.name}, Floor ${floorNumber}, Room ${roomNumber}`);
  } catch (error) {
    await tx.abort();
    console.error('Failed to add student:', error);
    throw error;
  }
};