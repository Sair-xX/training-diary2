function Streak({ streak, isStreakUp }) {
  return (
    <div className={`streak ${isStreakUp ? "streak-up" : ""}`}>
      <span className="streak-icon">🔥</span>
      <span className="streak-count">{streak}日連続で筋トレ中！</span>
    </div>
  );
}

export default Streak;