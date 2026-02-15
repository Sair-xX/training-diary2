import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
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

/* ===== 連続記録ロジック ===== */

function makeDateKeyLocal(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

function hasAnyRecord(entry) {
  const tags = entry?.tags;
  if (!tags) return false;
  return Object.values(tags).some(
    (v) => String(v).trim().length > 0
  );
}

function calcStreak(diaryData) {
  let count = 0;
  const cur = new Date();

  while (true) {
    const key = makeDateKeyLocal(cur);
    if (hasAnyRecord(diaryData[key])) {
      count++;
      cur.setDate(cur.getDate() - 1);
    } else {
      break;
    }
  }

  return count;
}

/* ===== HomePage ===== */

function HomePage() {
  const now = new Date();
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(now.getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState(now.getDate());
  const [diaryData, setDiaryData] = useState(loadDiaryData);
  const [streak, setStreak] = useState(() =>
    calcStreak(loadDiaryData())
  );

  const navigate = useNavigate();

  const tagList = ["胸", "肩", "2頭筋", "3頭筋"];
  const [selectedTag, setSelectedTag] = useState(tagList[0]);

  const dateKey = (day) => {
    const mm = String(currentMonth).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return `${currentYear}-${mm}-${dd}`;
  };

  const handleDateSelect = (day) => setSelectedDay(day);

  const handleCommentChange = (day, text) => {
    const key = dateKey(day);
    setDiaryData((prev) => ({
      ...prev,
      [key]: {
        ...(prev[key] ?? {}),
        tags: {
          ...((prev[key]?.tags) ?? {}),
          [selectedTag]: text,
        },
      },
    }));
  };

  const handleTagChange = (_day, tag) => {
    setSelectedTag(tag);
  };

  const handleSave = () => {
    localStorage.setItem("diaryData", JSON.stringify(diaryData));
    setStreak(calcStreak(diaryData));
  };

  useEffect(() => {
    setStreak(calcStreak(diaryData));
  }, [diaryData]);

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentYear((y) => y - 1);
      setCurrentMonth(12);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setSelectedDay(1);
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentYear((y) => y + 1);
      setCurrentMonth(1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setSelectedDay(1);
  };

  const handleTagNavigate = (tag) => navigate(`/tag/${tag}`);

  const selectedKey = dateKey(selectedDay);
  const selectedComment =
    diaryData[selectedKey]?.tags?.[selectedTag] ?? "";

  return (
    <div className="app">
      {/* ===== ヘッダー ===== */}
      <Header />

      {/* ===== タグメニュー（上） ===== */}
      <div className="tag-menu">
        {tagList.map((tag) => (
          <button
            key={tag}
            className="tag-btn"
            onClick={() => handleTagNavigate(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* ===== 300pxの暗い間 ===== */}
      <div className="homeBigGap" />

      {/* ===== 連続記録（下） ===== */}
      <Streak streak={streak} isStreakUp={streak > 0} />

      {/* ===== カレンダー ===== */}
      <Calendar
        year={currentYear}
        month={currentMonth}
        selectedDay={selectedDay}
        onDateSelect={handleDateSelect}
      />

      {/* ===== 日記入力 ===== */}
      <DiaryEditor
        selectedDay={selectedDay}
        data={{ comment: selectedComment, tag: selectedTag }}
        onCommentChange={handleCommentChange}
        onTagChange={handleTagChange}
        onSave={handleSave}
        tagList={tagList}
      />

      {/* ===== 月移動 ===== */}
      <div className="month-nav">
        <button className="month-nav-btn" onClick={handlePrevMonth}>
          ← 前月
        </button>

        <span className="month-nav-label">
          {currentYear}年{currentMonth}月
        </span>

        <button className="month-nav-btn" onClick={handleNextMonth}>
          次月 →
        </button>
      </div>
    </div>
  );
}

/* ===== Router ===== */

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
