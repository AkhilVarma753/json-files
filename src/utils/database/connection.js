import { openDB } from 'idb';
import { DB_NAME, DB_VERSION, createSchema } from './schema';

let dbInstance = null;

export const getDatabase = async () => {
  if (!dbInstance) {
    try {
      dbInstance = await openDB(DB_NAME, DB_VERSION, {
        upgrade(db, oldVersion, newVersion) {
          // Delete existing stores on version change
          Array.from(db.objectStoreNames).forEach(store => {
            db.deleteObjectStore(store);
          });
          
          // Create fresh schema
          createSchema(db);
        },
        blocked() {
          console.warn('Database upgrade blocked. Please close other tabs using this application.');
        },
        blocking() {
          console.warn('Database upgrade blocking other connections.');
          dbInstance?.close();
          dbInstance = null;
        },
        terminated() {
          console.error('Database connection terminated unexpectedly.');
          dbInstance = null;
        }
      });
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }
  return dbInstance;
};