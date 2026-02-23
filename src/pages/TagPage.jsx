import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";

function dayLabel(dateKey) {
  return dateKey;
}

export default function TagPage({ diaryData = {} }) {
  const { tagName } = useParams();

  const [query, setQuery] = useState("");
  const [sortDesc, setSortDesc] = useState(false);

  const rows = useMemo(() => {
    let list = Object.keys(diaryData)
      .map((dateKey) => {
        const comment = diaryData?.[dateKey]?.tags?.[tagName] ?? "";
        return { dateKey, comment };
      })
      .filter((x) => x.comment && x.comment.trim().length > 0);

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (x) =>
          x.dateKey.toLowerCase().includes(q) ||
          x.comment.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) =>
      sortDesc
        ? a.dateKey < b.dateKey ? 1 : -1
        : a.dateKey > b.dateKey ? 1 : -1
    );

    return list;
  }, [diaryData, tagName, query, sortDesc]);

  return (
    <div className="tagOldPage">
      <div className="tagOldHero">
        <div className="tagOldHeroInner">
          <div className="tagOldHeroTitle">💪 筋トレ日記</div>
        </div>
      </div>

      <div className="tagOldWrap">
        <div className="tagOldSectionTitle">💪 {tagName}の記録一覧</div>

        <div className="tagOldControls">
          <input
            className="tagOldSearch"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="検索（例: 2026-02 / ベンチ など）"
          />
          <button className="tagOldSort" onClick={() => setSortDesc((v) => !v)}>
            {sortDesc ? "新しい順" : "古い順"}
          </button>
        </div>

        <div className="tagOldTable">
          <div className="tagOldTableHead">
            <div className="tagOldTh">日付</div>
            <div className="tagOldTh">コメント</div>
          </div>

          <div className="tagOldTableBody">
            {rows.length === 0 ? (
              <div className="tagOldEmpty">このタグのコメントはまだありません</div>
            ) : (
              rows.map((r) => (
                <div className="tagOldTr" key={r.dateKey}>
                  <div className="tagOldTd tagOldDate">{dayLabel(r.dateKey)}</div>
                  <div className="tagOldTd tagOldComment">{r.comment}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="tagOldBottom">
          <Link to="/" className="tagOldBackBtn">
            🏠 トップに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}