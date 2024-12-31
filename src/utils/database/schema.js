export const DB_NAME = 'hostelDB';
export const DB_VERSION = 3; // Increment version to trigger clean upgrade

export const STORES = {
  HOSTELS: 'hostels',
  STUDENTS: 'students'
};

export const INDICES = {
  HOSTEL_ROOM: 'hostel_room'
};

export const createSchema = (db) => {
  // Create hostels store
  if (!db.objectStoreNames.contains(STORES.HOSTELS)) {
    const hostelStore = db.createObjectStore(STORES.HOSTELS, { 
      keyPath: 'id',
      autoIncrement: true 
    });
    // Remove unique constraint from name index
    hostelStore.createIndex('name', 'name', { unique: false });
  }

  // Create students store with indices
  if (!db.objectStoreNames.contains(STORES.STUDENTS)) {
    const studentStore = db.createObjectStore(STORES.STUDENTS, { 
      keyPath: 'id',
      autoIncrement: true 
    });
    // Composite index for room occupancy
    studentStore.createIndex(INDICES.HOSTEL_ROOM, 
      ['hostel_id', 'floor_number', 'room_number'], 
      { unique: false }
    );
  }
};