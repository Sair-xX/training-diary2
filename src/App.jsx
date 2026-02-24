import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { auth, provider, db } from "./firebase.js";
import Header from "./components/Header.jsx";
import Calendar from "./components/Calendar.jsx";
import Streak from "./components/Streak.jsx";
import DiaryEditor from "./components/DiaryEditor.jsx";
import TagPage from "./pages/TagPage.jsx";
import "./index.css";

function makeDateKeyLocal(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

function hasAnyRecord(entry) {
  const tags = entry?.tags;
  if (!tags) return false;
  return Object.values(tags).some((v) => String(v).trim().length > 0);
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

function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, provider);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-icon">💪</div>
        <h1 className="login-title">筋トレ日記</h1>
        <p className="login-subtitle">記録を残して、毎日続けよう</p>
        <button className="login-btn" onClick={handleLogin} disabled={loading}>
          {loading ? "ログイン中..." : "Googleでログイン"}
        </button>
      </div>
    </div>
  );
}

function HomePage({ user, diaryData, setDiaryData }) {
  const now = new Date();
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(now.getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState(now.getDate());
  const [streak, setStreak] = useState(() => calcStreak(diaryData));
  const [saving, setSaving] = useState(false);
  const [localComment, setLocalComment] = useState("");

  const navigate = useNavigate();

  const tagList = ["胸", "肩", "2頭筋", "3頭筋"];
  const [selectedTag, setSelectedTag] = useState(tagList[0]);

  const dateKey = (day) => {
    const mm = String(currentMonth).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return `${currentYear}-${mm}-${dd}`;
  };

  const selectedKey = dateKey(selectedDay);

  // 日付かタグが変わったらローカルコメントをリセット
  useEffect(() => {
    setLocalComment(diaryData[selectedKey]?.tags?.[selectedTag] ?? "");
  }, [selectedDay, selectedTag, selectedKey]);

  const handleDateSelect = (day) => setSelectedDay(day);

  const handleCommentChange = (_day, text) => {
    setLocalComment(text);
  };

  const handleTagChange = (_day, tag) => {
    setSelectedTag(tag);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const newData = {
        ...diaryData,
        [selectedKey]: {
          ...(diaryData[selectedKey] ?? {}),
          tags: {
            ...((diaryData[selectedKey]?.tags) ?? {}),
            [selectedTag]: localComment,
          },
        },
      };
      const ref = doc(db, "diaries", user.uid);
      await setDoc(ref, { data: newData }, { merge: false });
      setDiaryData(newData);
      setStreak(calcStreak(newData));
    } catch (e) {
      console.error("保存失敗:", e);
      alert("保存に失敗しました");
    } finally {
      setSaving(false);
    }
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
  const handleLogout = () => signOut(auth);

  return (
    <div className="app">
      <Header />

      <div className="user-bar">
        <img className="user-avatar" src={user.photoURL} alt={user.displayName} />
        <span className="user-name">{user.displayName}</span>
        <button className="logout-btn" onClick={handleLogout}>
          ログアウト
        </button>
      </div>

      <div className="tag-menu">
        {tagList.map((tag) => (
          <button key={tag} className="tag-btn" onClick={() => handleTagNavigate(tag)}>
            {tag}
          </button>
        ))}
      </div>

      <div className="homeBigGap" />

      <Streak streak={streak} isStreakUp={streak > 0} />

      <Calendar
        year={currentYear}
        month={currentMonth}
        selectedDay={selectedDay}
        onDateSelect={handleDateSelect}
      />

      <DiaryEditor
        selectedDay={selectedDay}
        data={{ comment: localComment, tag: selectedTag }}
        onCommentChange={handleCommentChange}
        onTagChange={handleTagChange}
        onSave={handleSave}
        tagList={tagList}
        saving={saving}
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
  const [user, setUser] = useState(null);
  const [diaryData, setDiaryData] = useState({});
  const [authLoading, setAuthLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);

      if (currentUser) {
        setDataLoading(true);
        try {
          const ref = doc(db, "diaries", currentUser.uid);
          const snap = await getDoc(ref);
          if (snap.exists()) {
            setDiaryData(snap.data().data ?? {});
          }
        } catch (e) {
          console.error("データ読み込み失敗:", e);
        } finally {
          setDataLoading(false);
        }
      } else {
        setDiaryData({});
      }
    });

    return () => unsubscribe();
  }, []);

  if (authLoading || dataLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-icon">💪</div>
        <p>読み込み中...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              user={user}
              diaryData={diaryData}
              setDiaryData={setDiaryData}
            />
          }
        />
        <Route
          path="/tag/:tagName"
          element={<TagPage diaryData={diaryData} />}
        />
      </Routes>
    </Router>
  );
}