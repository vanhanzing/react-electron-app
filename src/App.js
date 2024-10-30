import React, { useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const [sessionData, setSessionData] = useState(null);

  useEffect(() => {
    if (window.electron) {
      window.electron.receive('session-data', (data) => {
        setSessionData(data.sessionData);
      });
    }
  }, []);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Instagram Session Data</h1>
      <button
        onClick={() => window.electron.send('open-browser')}
        style={{ padding: '10px 20px', fontSize: '16px', marginBottom: '20px' }}
      >
        Connect to Instagram
      </button>

      {sessionData && (
        <div
          style={{
            textAlign: 'left',
            maxWidth: '500px',
            margin: '0 auto',
            padding: '20px',
            border: '1px solid #ccc',
          }}
        >
          <h3>Session Data (JSON Format)</h3>
          <pre className="selectable">
            {JSON.stringify(sessionData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default App;
