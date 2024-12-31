import * as d3 from 'd3';
import React, { useEffect, useRef } from 'react';
import { HOSTEL_CONFIG, ROOM_STATUS, STATUS_COLORS } from '../constants/hostelConfig';

const getRoomStatus = (occupants) => {
  if (occupants === 0) return ROOM_STATUS.EMPTY;
  if (occupants === 1) return ROOM_STATUS.PARTIAL;
  return ROOM_STATUS.FULL;
};

const HostelBlock = ({ data, hostelName }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || !data.length) return;

    const margin = { top: 40, right: 20, bottom: 20, left: 40 };
    const width = 400;
    const height = 500;
    const roomWidth = 30;
    const roomHeight = 25;
    const floorHeight = 100;

    // Clear previous SVG
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add hostel title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -20)
      .attr('text-anchor', 'middle')
      .attr('class', 'font-bold text-lg')
      .text(hostelName);

    // Create floors and rooms
    for (let floor = HOSTEL_CONFIG.FLOORS; floor >= 1; floor--) {
      const floorGroup = svg.append('g')
        .attr('transform', `translate(0, ${(HOSTEL_CONFIG.FLOORS - floor + 1) * floorHeight})`);

      // Floor line
      floorGroup.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', width)
        .attr('y2', 0)
        .attr('stroke', '#cbd5e1')
        .attr('stroke-width', 2);

      // Rooms
      for (let room = 1; room <= HOSTEL_CONFIG.ROOMS_PER_FLOOR; room++) {
        const roomData = data.find(d => 
          d.floor_number === floor && d.room_number === room
        );
        
        const occupants = roomData ? roomData.occupants : 0;
        const status = getRoomStatus(occupants);

        // Room group
        const roomGroup = floorGroup.append('g')
          .attr('transform', `translate(${room * (roomWidth + 5)}, 10)`);

        // Room rectangle
        roomGroup.append('rect')
          .attr('width', roomWidth)
          .attr('height', roomHeight)
          .attr('fill', STATUS_COLORS[status])
          .attr('stroke', '#64748b')
          .attr('stroke-width', 1)
          .attr('rx', 4)
          .attr('ry', 4);

        // Room number
        roomGroup.append('text')
          .attr('x', roomWidth/2)
          .attr('y', roomHeight + 15)
          .attr('text-anchor', 'middle')
          .attr('font-size', '12px')
          .attr('fill', '#475569')
          .text(room);

        // Add tooltip with occupancy information
        roomGroup.append('title')
          .text(`Room ${room} (Floor ${floor}): ${occupants} student(s)`);
      }

      // Floor number
      floorGroup.append('text')
        .attr('x', -25)
        .attr('y', roomHeight + 15)
        .attr('text-anchor', 'middle')
        .attr('font-size', '14px')
        .attr('font-weight', 'bold')
        .attr('fill', '#475569')
        .text(`F${floor}`);
    }
  }, [data, hostelName]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <svg ref={svgRef} className="w-full h-auto"></svg>
    </div>
  );
};

export default HostelBlock;