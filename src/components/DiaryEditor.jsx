import { useState } from "react";

function DiaryEditor({ selectedDay, data, onCommentChange, onTagChange, onSave, onDelete, tagList, saving }) {
  const [saveMsg, setSaveMsg] = useState(false);

  if (!selectedDay) selectedDay = new Date().getDate();

  const handleSave = async () => {
    await onSave();
    setSaveMsg(true);
    setTimeout(() => setSaveMsg(false), 2000);
  };

  return (
    <div className="diary-editor">
      <h3>{selectedDay}日の日記</h3>

      <textarea
        value={data.comment || ""}
        onChange={(e) => onCommentChange(selectedDay, e.target.value)}
        placeholder="今日のトレーニングを記録..."
      />

      <div className="tag-selector">
        {tagList.map((tag) => (
          <button
            key={tag}
            className={`tag-btn ${data.tag === tag ? "selected" : ""}`}
            onClick={() => onTagChange(selectedDay, tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      <button className="save-btn" onClick={handleSave} disabled={saving}>
        {saving ? "保存中..." : "💪 保存"}
      </button>
      {saveMsg && <span className="save-msg">✅ 保存しました！</span>}

      <button className="delete-btn" onClick={() => {
        if (window.confirm("この日の記録を削除しますか？")) {
          onDelete();
        }
      }}>
        🗑️ 削除
      </button>
    </div>
  );
}

export default DiaryEditor;