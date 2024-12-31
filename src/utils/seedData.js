import { faker } from '@faker-js/faker';
import { addStudent, getDatabase } from './database/index.js';
import { HOSTEL_CONFIG } from '../constants/hostelConfig';
import { STORES } from './database/schema';

const MAX_RETRIES = 3;

export const seedDatabase = async () => {
  const db = await getDatabase();
  
  try {
    // Check if students already exist
    const studentCount = await db.count(STORES.STUDENTS);
    if (studentCount > 0) {
      console.log('Database already seeded');
      return;
    }
    
    console.log('Starting database seeding...');
    
    // Generate random students for each hostel
    for (let hostelId = 1; hostelId <= HOSTEL_CONFIG.BLOCKS.length; hostelId++) {
      let successfulAdds = 0;
      const targetStudents = 25; // Target number of students per hostel
      
      while (successfulAdds < targetStudents) {
        let retries = 0;
        let added = false;
        
        while (retries < MAX_RETRIES && !added) {
          const floorNumber = Math.floor(Math.random() * HOSTEL_CONFIG.FLOORS) + 1;
          const roomNumber = Math.floor(Math.random() * HOSTEL_CONFIG.ROOMS_PER_FLOOR) + 1;
          
          try {
            await addStudent(
              faker.person.fullName(),
              hostelId,
              floorNumber,
              roomNumber
            );
            added = true;
            successfulAdds++;
            console.log(`Added student ${successfulAdds}/${targetStudents} to hostel ${hostelId}`);
          } catch (error) {
            if (!error.message.includes('maximum capacity')) {
              throw error;
            }
            retries++;
          }
        }
        
        if (!added) {
          console.warn(`Failed to add student after ${MAX_RETRIES} retries for hostel ${hostelId}`);
          break; // Move to next hostel if we can't find space after multiple retries
        }
      }
    }
    
    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw new Error(`Failed to seed database: ${error.message}`);
  }
};