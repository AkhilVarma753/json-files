export const HOSTEL_CONFIG = {
  FLOORS: 4,
  ROOMS_PER_FLOOR: 10,
  MAX_OCCUPANTS: 2,
  BLOCKS: ['A Block', 'B Block', 'C Block', 'D Block']
};

export const ROOM_STATUS = {
  EMPTY: 'empty',
  PARTIAL: 'partial',
  FULL: 'full'
};

export const STATUS_COLORS = {
  [ROOM_STATUS.EMPTY]: 'rgb(34, 197, 94)',    // green-500
  [ROOM_STATUS.PARTIAL]: 'rgb(249, 115, 22)', // yellow-500
  [ROOM_STATUS.FULL]: 'rgb(239, 68, 68)'      // red-500
};