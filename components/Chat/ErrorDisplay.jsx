const ErrorDisplay = ({ error }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#f7fafc' }}>
    <div style={{ color: '#f56565', padding: '16px', textAlign: 'center', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '8px' }}>Error</h2>
      <p>{error}</p>
      <button
        onClick={() => window.location.reload()}
        style={{ marginTop: '16px', backgroundColor: '#667eea', color: '#fff', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', transition: 'background-color 0.3s' }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#5a67d8'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#667eea'}
      >
        Retry
      </button>
    </div>
  </div>
);

export default ErrorDisplay;
