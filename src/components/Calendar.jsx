const TAG_COLORS = {
  "胸":   "#e53935",
  "肩":   "#8e24aa",
  "2頭筋": "#1e88e5",
  "3頭筋": "#00897b",
  "背中":  "#f57c00",
  "脚":   "#6d4c41",
  "休み":  "#546e7a",
};

function Calendar({ year, month, selectedDay, onDateSelect, cycleColorMap = {} }) {
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  const dateKey = (day) => {
    const mm = String(month).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return `${year}-${mm}-${dd}`;
  };

  return (
    <div className="calendar-container">
      {weekdays.map((d, i) => (
        <div key={i} className="calendar-weekday">{d}</div>
      ))}
      {blanks.map((i) => (
        <div key={`blank-${i}`} className="calendar-blank" />
      ))}
      {days.map((day) => {
        const key = dateKey(day);
        const cycleItems = cycleColorMap[key];
        const firstColor = cycleItems ? (TAG_COLORS[cycleItems[0]] ?? "#ff9800") : null;
        return (
          <div
            key={day}
            className={`calendar-day ${selectedDay === day ? "selected" : ""}`}
            onClick={() => onDateSelect(day)}
            style={firstColor && selectedDay !== day ? {
              borderColor: firstColor,
              boxShadow: `0 0 8px ${firstColor}66`,
              color: "#fff",
            } : {}}
          >
            {day}
          </div>
        );
      })}
    </div>
  );
}

export default Calendar;