import React, { useState } from 'react';
import { FaUserCircle, FaRobot } from 'react-icons/fa';

function App() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const payload = { question: query };
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:8000/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setResponse(data.response);
      setHistory([{ question: query, answer: data.response }, ...history]);
    } catch (err) {
      setResponse('Could not connect to backend.');
    } finally {
      setIsLoading(false);
      setQuery('');
    }
  };

  const clearHistory = () => {
    setHistory([]);
    setResponse(null);
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const themeStyles = {
    background: darkMode ? '#18191a' : '#f0f2f5',
    color: darkMode ? '#e4e6eb' : '#050505',
    transition: 'all 0.3s ease-in-out',
  };

  return (
    <div style={{ ...styles.container, ...themeStyles }}>
      <div style={styles.topRightControls}>
        <button onClick={toggleDarkMode} style={styles.toggleButton}>
          {darkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            style={{ ...styles.toggleButton, backgroundColor: '#f02849' }}
          >
            Clear Chats
          </button>
        )}
      </div>

      <div style={styles.titleSection}>
        <h1 style={{ ...styles.heading, color: themeStyles.color }}>
          FinVisor
        </h1>
        <p style={{ ...styles.tagline, color: themeStyles.color }}>
          Your Personal AI powered Financial Advisor
        </p>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Ask anything about finance..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            ...styles.input,
            backgroundColor: darkMode ? '#3a3b3c' : '#ffffff',
            color: themeStyles.color,
            borderColor: darkMode ? '#4e4f50' : '#ced0d4',
          }}
        />
        <button type="submit" style={styles.button}>
          {isLoading ? 'Generating...' : 'Ask'}
        </button>
      </form>

      {response && (
        <div
          style={{
            ...styles.responseCard,
            backgroundColor: darkMode ? '#242526' : '#ffffff',
            color: themeStyles.color,
          }}
        >
          <div style={styles.chatBlock}>
            <FaUserCircle size={26} color="#1877f2" style={styles.icon} />
            <strong> You:</strong>&nbsp;{history[0].question}
          </div>
          <div style={styles.chatBlock}>
            <FaRobot size={24} color="#42b72a" style={styles.icon} />
            <strong> FinVisor:</strong>&nbsp;{history[0].answer}
          </div>
        </div>
      )}

      {history.length > 1 && (
        <div style={styles.historySection}>
          <h3 style={{ color: themeStyles.color }}>Previous Interactions</h3>
          <ul style={styles.historyList}>
            {history.slice(1).map((item, idx) => (
              <li
                key={idx}
                style={{
                  ...styles.historyItem,
                  backgroundColor: darkMode ? '#3a3b3c' : '#e4e6eb',
                  color: themeStyles.color,
                }}
              >
                <div style={styles.chatBlock}>
                  <FaUserCircle size={20} color="#1877f2" style={styles.icon} />
                  <strong> You:</strong> {item.question}
                </div>
                <div style={styles.chatBlock}>
                  <FaRobot size={18} color="#42b72a" style={styles.icon} />
                  <strong> FinVisor:</strong> {item.answer}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Helvetica, Arial, sans-serif',
    minHeight: '100vh',
    padding: '40px 20px',
    textAlign: 'center',
    position: 'relative',
  },
  topRightControls: {
    position: 'absolute',
    top: 20,
    right: 20,
    display: 'flex',
    gap: '10px',
  },
  toggleButton: {
    backgroundColor: '#1877f2',
    color: '#fff',
    padding: '8px 16px',
    fontSize: '0.9rem',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background 0.3s ease-in-out',
  },
  titleSection: {
    marginTop: '30px',
    marginBottom: '20px',
  },
  heading: {
    fontSize: '2.8rem',
    margin: 0,
    fontWeight: 'bold',
  },
  tagline: {
    fontSize: '1.1rem',
    marginTop: '5px',
    opacity: 0.8,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '30px',
  },
  input: {
    width: '90%',
    maxWidth: '500px',
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    outline: 'none',
  },
  button: {
    backgroundColor: '#42b72a',
    color: '#fff',
    padding: '10px 20px',
    fontSize: '1rem',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background 0.3s ease-in-out',
  },
  responseCard: {
    maxWidth: '700px',
    margin: '20px auto',
    padding: '20px',
    borderRadius: '15px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    textAlign: 'left',
  },
  chatBlock: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    marginBottom: '10px',
  },
  icon: {
    marginTop: '4px',
  },
  historySection: {
    marginTop: '40px',
    textAlign: 'left',
    paddingLeft: '10%',
    paddingRight: '10%',
  },
  historyList: {
    listStyle: 'none',
    padding: 0,
  },
  historyItem: {
    padding: '12px',
    borderRadius: '10px',
    marginBottom: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
};

export default App;
