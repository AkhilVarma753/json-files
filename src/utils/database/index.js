import { getDatabase } from './connection';
import { initializeHostels } from './hostelOperations';
import { addStudent } from './studentOperations';
import { getHostelOccupancy } from './occupancyOperations';
import { STORES } from './schema';

export const initializeDatabase = async () => {
  try {
    const db = await getDatabase();
    
    // Check if hostels exist
    const hostelCount = await db.count(STORES.HOSTELS);
    
    if (hostelCount === 0) {
      console.log('No hostels found, initializing...');
      await initializeHostels();
    } else {
      console.log('Hostels already initialized');
    }
    
    return db;
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
};

export {
  getDatabase,
  initializeHostels,
  addStudent,
  getHostelOccupancy
};