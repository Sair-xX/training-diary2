function Calendar({ year, month, selectedDay, onDateSelect }) {
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  return (
    <div className="calendar-container">
      {weekdays.map((d, i) => (
        <div key={i} className="calendar-weekday">{d}</div>
      ))}
      {blanks.map((i) => (
        <div key={`blank-${i}`} className="calendar-blank" />
      ))}
      {days.map((day) => (
        <div
          key={day}
          className={`calendar-day ${selectedDay === day ? "selected" : ""}`}
          onClick={() => onDateSelect(day)}
        >
          {day}
        </div>
      ))}
    </div>
  );
}

export default Calendar;