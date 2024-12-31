import { openDB } from 'idb';
import { HOSTEL_CONFIG } from '../constants/hostelConfig';

const DB_NAME = 'hostelDB';
const DB_VERSION = 2; // Increment version to trigger upgrade

const initDB = async () => {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion, transaction) {
      // Delete old stores if they exist
      if (oldVersion < 2) {
        if (db.objectStoreNames.contains('hostels')) {
          db.deleteObjectStore('hostels');
        }
        if (db.objectStoreNames.contains('students')) {
          db.deleteObjectStore('students');
        }
      }

      // Create hostels store without unique constraint
      if (!db.objectStoreNames.contains('hostels')) {
        const hostelStore = db.createObjectStore('hostels', { 
          keyPath: 'id', 
          autoIncrement: true 
        });
      }

      // Create students store
      if (!db.objectStoreNames.contains('students')) {
        const studentStore = db.createObjectStore('students', { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        studentStore.createIndex('hostel_room', ['hostel_id', 'floor_number', 'room_number']);
      }
    },
  });
  return db;
};

export const initializeHostels = async () => {
  const db = await initDB();
  const tx = db.transaction('hostels', 'readwrite');
  const store = tx.objectStore('hostels');

  // Clear existing data
  await store.clear();

  // Add hostels sequentially
  for (const name of HOSTEL_CONFIG.BLOCKS) {
    await store.add({
      name,
      total_floors: HOSTEL_CONFIG.FLOORS,
      rooms_per_floor: HOSTEL_CONFIG.ROOMS_PER_FLOOR
    });
  }

  await tx.done;
};

export const getHostelOccupancy = async () => {
  const db = await initDB();
  const hostels = await db.getAll('hostels');
  const students = await db.getAll('students');
  
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
      room.occupants++;
    }
  });

  return Array.from(occupancyMap.values());
};

export const addStudent = async (name, hostelId, floorNumber, roomNumber) => {
  const db = await initDB();
  const tx = db.transaction('students', 'readwrite');
  const store = tx.objectStore('students');
  
  // Check current occupancy
  const index = store.index('hostel_room');
  const occupants = await index.getAll([hostelId, floorNumber, roomNumber]);
  
  if (occupants.length >= HOSTEL_CONFIG.MAX_OCCUPANTS) {
    throw new Error('Room is already at maximum capacity');
  }

  await store.add({
    name,
    hostel_id: hostelId,
    floor_number: floorNumber,
    room_number: roomNumber,
    admission_date: new Date().toISOString()
  });

  await tx.done;
};

export const initializeDatabase = async () => {
  await initDB();
  await initializeHostels();
};

export default { initDB, initializeHostels, getHostelOccupancy, addStudent };