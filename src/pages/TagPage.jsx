import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import "../index.css";

export default function TagPage() {
  const { tagName } = useParams();

  // デモ用データ（本番はAppからContextやpropsで渡す）
  const diaryData = {
    1: { comment: "胸を鍛えた", tag: "胸" },
    2: { comment: "肩中心", tag: "肩" },
    3: { comment: "2頭筋トレ", tag: "2頭筋" },
    4: { comment: "3頭筋", tag: "3頭筋" },
    5: { comment: "胸軽め", tag: "胸" },
  };

  const filtered = Object.entries(diaryData).filter(([day, data]) => data.tag === tagName);

  return (
    <div className="app">
      <Header />

      <h2 style={{ margin: "24px 0", color: "#ffc107", textAlign: "center", fontWeight: "900", textShadow: "0 2px 8px rgba(255, 193, 7, 0.5)" }}>
        💪 {tagName}の記録一覧
      </h2>

      <table className="tag-table">
        <thead>
          <tr>
            <th>日付</th>
            <th>コメント</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={2}>まだ記録がありません</td>
            </tr>
          ) : (
            filtered.map(([day, data]) => (
              <tr key={day}>
                <td>{day}日</td>
                <td>{data.comment}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div style={{ textAlign: "center", marginTop: "24px" }}>
        <Link to="/" className="tag-btn">🏠 トップに戻る</Link>
      </div>
    </div>
  );
}