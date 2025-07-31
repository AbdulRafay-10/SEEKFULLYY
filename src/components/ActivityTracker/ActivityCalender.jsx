import React, { useState } from 'react';
import {
  startOfMonth,
  getDay,
  getDaysInMonth,
  addMonths,
  subMonths,
  addDays,
  isSameDay,
  isSameMonth,
  format,
} from 'date-fns';
import '../../styles/custom-calendar.css';

const CustomCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2021, 7)); // August 2021
  const [filledDate, setFilledDate] = useState(new Date(2021, 7, 31)); // Initially 31 Aug

  const startDate = startOfMonth(currentMonth);
  const startDay = getDay(startDate); // 0 = Sunday
  const daysInMonth = getDaysInMonth(currentMonth);
  const totalCells = Math.ceil((startDay + daysInMonth) / 7) * 7;

  const outlinedDays = new Set(Array.from({ length: 16 }, (_, i) => 15 + i)); // 15–30

  const dates = [];
  for (let i = 0; i < totalCells; i++) {
    const date = addDays(startDate, i - startDay);
    const isCurrentMonth = isSameMonth(date, currentMonth);
    const isOutlined = outlinedDays.has(date.getDate()) && isCurrentMonth;
    const isFilled = isSameDay(date, filledDate);

    dates.push(
      <div
        key={i}
        className={`date-cell
          ${isCurrentMonth ? '' : 'not-current'}
          ${isOutlined ? 'outlined' : ''}
          ${isFilled ? 'filled' : ''}`}
        onClick={() => {
          if (isCurrentMonth) setFilledDate(date);
        }}
      >
        {date.getDate()}
      </div>
    );
  }

  return (
    <div className="calendar-box">
      {/* Header */}
      <div className="calendar-header">
        <button className="nav-button" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          ←
        </button>
        <span className="month-label">
          {format(currentMonth, 'MMMM yyyy')}
        </span>
        <button className="nav-button" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          →
        </button>
      </div>

      {/* Weekday Labels */}
      <div className="weekdays">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
          <div key={idx} className="weekday">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid cursor-pointer">{dates}</div>
    </div>
  );
};

export default CustomCalendar;
