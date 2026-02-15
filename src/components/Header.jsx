function Header() {
  return (
    <div className="app-header" style={{
      background: 'linear-gradient(135deg, #ff5722, #ff9800)',
      padding: '40px 20px',
      borderRadius: '0 0 24px 24px',
      boxShadow: '0 8px 32px rgba(255, 87, 34, 0.3)'
    }}>
      <h1 className="header-title">💪 筋トレ日記</h1>
    </div>
  );
}

export default Header;
