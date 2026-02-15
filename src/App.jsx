import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Header from "./components/Header.jsx";
import Calendar from "./components/Calendar.jsx";
import Streak from "./components/Streak.jsx";
import DiaryEditor from "./components/DiaryEditor.jsx";
import TagPage from "./pages/TagPage.jsx";
import "./index.css";

function loadDiaryData() {
  try {
    const raw = localStorage.getItem("diaryData");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function HomePage() {
  const now = new Date();
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(now.getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState(now.getDate());
  const [streak, setStreak] = useState(0);
  const [diaryData, setDiaryData] = useState(loadDiaryData);
  const navigate = useNavigate();

  const tagList = ["胸", "肩", "2頭筋", "3頭筋"];

  const dateKey = (day) => {
    const mm = String(currentMonth).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return `${currentYear}-${mm}-${dd}`;
  };

  const handleDateSelect = (day) => setSelectedDay(day);

  const handleCommentChange = (day, text) => {
    const key = dateKey(day);
    setDiaryData(prev => ({ ...prev, [key]: { ...prev[key], comment: text } }));
  };

  const handleTagChange = (day, tag) => {
    const key = dateKey(day);
    setDiaryData(prev => ({ ...prev, [key]: { ...prev[key], tag } }));
  };

  const handleSave = () => {
    localStorage.setItem("diaryData", JSON.stringify(diaryData));
  };

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentYear(y => y - 1);
      setCurrentMonth(12);
    } else {
      setCurrentMonth(m => m - 1);
    }
    setSelectedDay(1);
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentYear(y => y + 1);
      setCurrentMonth(1);
    } else {
      setCurrentMonth(m => m + 1);
    }
    setSelectedDay(1);
  };

  const handleTagNavigate = (tag) => navigate(`/tag/${tag}`);

  const selectedKey = dateKey(selectedDay);

  return (
    <div className="app">
      <Header />
      <Streak streak={streak} isStreakUp={true} />

      <div className="tag-menu">
        {tagList.map(tag => (
          <button
            key={tag}
            className="tag-btn"
            onClick={() => handleTagNavigate(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      <Calendar
        year={currentYear}
        month={currentMonth}
        selectedDay={selectedDay}
        onDateSelect={handleDateSelect}
      />

      <DiaryEditor
        selectedDay={selectedDay}
        data={diaryData[selectedKey] || { comment: "", tag: "" }}
        onCommentChange={handleCommentChange}
        onTagChange={handleTagChange}
        onSave={handleSave}
        tagList={tagList}
      />

      <div className="month-nav">
        <button className="month-nav-btn" onClick={handlePrevMonth}>← 前月</button>
        <span className="month-nav-label">{currentYear}年{currentMonth}月</span>
        <button className="month-nav-btn" onClick={handleNextMonth}>次月 →</button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tag/:tagName" element={<TagPage />} />
      </Routes>
    </Router>
  );
}