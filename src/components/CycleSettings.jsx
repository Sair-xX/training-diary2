import { useState } from "react";

const TAG_COLORS = {
  "胸":   "#e53935",
  "肩":   "#8e24aa",
  "2頭筋": "#1e88e5",
  "3頭筋": "#00897b",
  "背中":  "#f57c00",
  "脚":   "#6d4c41",
  "休み":  "#546e7a",
};

function CycleSettings({ cycleSettings, onChange }) {
  const allOptions = ["胸", "肩", "2頭筋", "3頭筋", "背中", "脚", "休み"];
  const [cycle, setCycle] = useState(cycleSettings?.cycle ?? []);
  const [startDate, setStartDate] = useState(cycleSettings?.startDate ?? "");
  const [selectedItems, setSelectedItems] = useState([]);
  const [dragIndex, setDragIndex] = useState(null);

  const toggleItem = (item) => {
    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleAdd = () => {
    if (selectedItems.length === 0) return;
    const newCycle = [...cycle, selectedItems];
    setCycle(newCycle);
    setSelectedItems([]);
    onChange({ cycle: newCycle, startDate });
  };

  const handleRemove = (index) => {
    const newCycle = cycle.filter((_, i) => i !== index);
    setCycle(newCycle);
    onChange({ cycle: newCycle, startDate });
  };

  const handleStartDate = (e) => {
    setStartDate(e.target.value);
    onChange({ cycle, startDate: e.target.value });
  };

  const handleDragStart = (index) => setDragIndex(index);

  const handleDrop = (index) => {
    if (dragIndex === null || dragIndex === index) return;
    const newCycle = [...cycle];
    const [removed] = newCycle.splice(dragIndex, 1);
    newCycle.splice(index, 0, removed);
    setCycle(newCycle);
    setDragIndex(null);
    onChange({ cycle: newCycle, startDate });
  };

  return (
    <div className="cycle-settings">
      <h3 className="cycle-title">🔄 サイクル設定</h3>

      <div className="cycle-add-buttons">
        {allOptions.map((item) => (
          <button
            key={item}
            className={`cycle-add-btn ${selectedItems.includes(item) ? "cycle-add-btn-selected" : ""}`}
            style={{
              borderColor: TAG_COLORS[item],
              color: selectedItems.includes(item) ? "#fff" : TAG_COLORS[item],
              background: selectedItems.includes(item) ? TAG_COLORS[item] : "transparent",
            }}
            onClick={() => toggleItem(item)}
          >
            {item}
          </button>
        ))}
        <button
          className="cycle-confirm-btn"
          onClick={handleAdd}
          disabled={selectedItems.length === 0}
        >
          ✓ 追加
        </button>
      </div>

      <div className="cycle-list">
        {cycle.map((items, i) => {
          const itemsArr = Array.isArray(items) ? items : [items];
          const firstColor = TAG_COLORS[itemsArr[0]] ?? "#ff9800";
          return (
            <div
              key={i}
              className="cycle-item"
              style={{ background: firstColor }}
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(i)}
            >
              <span>{i + 1}. {itemsArr.join("・")}</span>
              <button className="cycle-remove-btn" onClick={() => handleRemove(i)}>✕</button>
            </div>
          );
        })}
        {cycle.length === 0 && <p className="cycle-empty">部位を選択して追加ボタンを押してください</p>}
      </div>

      <div className="cycle-start">
        <label className="cycle-start-label">開始日</label>
        <input
          type="date"
          className="cycle-start-input"
          value={startDate}
          onChange={handleStartDate}
        />
      </div>
    </div>
  );
}

export default CycleSettings;