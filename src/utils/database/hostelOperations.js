import { getDatabase } from './connection';
import { STORES } from './schema';
import { HOSTEL_CONFIG } from '../../constants/hostelConfig';

export const initializeHostels = async () => {
  try {
    const db = await getDatabase();
    const tx = db.transaction(STORES.HOSTELS, 'readwrite');
    const store = tx.objectStore(STORES.HOSTELS);

    // Clear existing data
    await store.clear();

    // Add hostels sequentially with explicit IDs
    const hostelPromises = HOSTEL_CONFIG.BLOCKS.map((name, index) => {
      return store.add({
        id: index + 1,
        name,
        total_floors: HOSTEL_CONFIG.FLOORS,
        rooms_per_floor: HOSTEL_CONFIG.ROOMS_PER_FLOOR
      });
    });

    await Promise.all(hostelPromises);
    await tx.done;
    console.log('Hostels initialized successfully');
  } catch (error) {
    console.error('Error initializing hostels:', error);
    throw error;
  }
};