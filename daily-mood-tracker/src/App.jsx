
import { useEffect, useState } from "react";
import "./App.css";

const moods = [
  { name: "Happy", emoji: "😊", color: "#fff0bd" },
  { name: "Sad", emoji: "😔", color: "#dce9ff" },
  { name: "Tired", emoji: "😴", color: "#eadfff" },
  { name: "Excited", emoji: "🤩", color: "#ffe0ec" },
  { name: "Calm", emoji: "😌", color: "#d9f7e8" },
  { name: "Anxious", emoji: "😟", color: "#ffe6d5" },
];

function App() {
  const [selectedMood, setSelectedMood] = useState("");
  const [note, setNote] = useState("");
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("moodHistory")) || [];
    } catch {
      return [];
    }
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    localStorage.setItem("moodHistory", JSON.stringify(history));
  }, [history]);

  function saveMood(event) {
    event.preventDefault();

    if (!selectedMood) {
      setMessage("Please select your mood first! 💗");
      return;
    }

    const mood = moods.find((item) => item.name === selectedMood);

    const newEntry = {
      id: `${Date.now()}-${Math.random()}`,
      name: mood.name,
      emoji: mood.emoji,
      note: note.trim(),
      date: new Date().toLocaleString(),
    };

    setHistory((previous) => [newEntry, ...previous]);
    setSelectedMood("");
    setNote("");
    setMessage("Your mood has been saved successfully! ✨");
  }

  function deleteMood(id) {
    setHistory((previous) => previous.filter((item) => item.id !== id));
    setMessage("Mood entry deleted.");
  }

  function clearHistory() {
    if (history.length === 0) {
      setMessage("Your history is already empty.");
      return;
    }

    if (window.confirm("Are you sure you want to delete all mood entries?")) {
      setHistory([]);
      setMessage("All mood entries have been cleared.");
    }
  }

  return (
    <main className="app">
      <header className="header">
        <div className="logo">🌷</div>
        <p className="eyebrow">YOUR LITTLE SPACE</p>
        <h1>Daily Mood Tracker</h1>
        <p className="subtitle">
          Every feeling matters. Take a moment for yourself.
        </p>
      </header>

      <section className="card">
        <h2>How are you feeling today?</h2>
        <p className="helper">Choose the mood that feels right for you.</p>

        <form onSubmit={saveMood}>
          <div className="mood-grid">
            {moods.map((mood) => (
              <button
                type="button"
                key={mood.name}
                className={`mood-option ${
                  selectedMood === mood.name ? "selected" : ""
                }`}
                style={{ "--mood-color": mood.color }}
                onClick={() => {
                  setSelectedMood(mood.name);
                  setMessage("");
                }}
                aria-pressed={selectedMood === mood.name}
              >
                <span className="mood-emoji">{mood.emoji}</span>
                <span>{mood.name}</span>
              </button>
            ))}
          </div>

          <label htmlFor="mood-note">A little note about your day</label>
          <textarea
            id="mood-note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="What happened today? Write anything on your mind..."
            rows="4"
            maxLength="500"
          />

          <div className="character-count">{note.length}/500</div>

          <button className="save-button" type="submit">
            Save My Mood 💗
          </button>

          {message && (
            <p className="message" role="status">
              {message}
            </p>
          )}
        </form>
      </section>

      <section className="history-section">
        <div className="history-heading">
          <div>
            <p className="eyebrow">YOUR JOURNEY</p>
            <h2>My Mood History 📖</h2>
          </div>

          <span className="count-badge">{history.length} entries</span>
        </div>

        {history.length === 0 ? (
          <div className="empty-state">
            <span>🌸</span>
            <h3>Your story starts here</h3>
            <p>Save your first mood, and it will appear here.</p>
          </div>
        ) : (
          <>
            <div className="history-list">
              {history.map((entry) => (
                <article className="history-item" key={entry.id}>
                  <div className="history-emoji">{entry.emoji}</div>

                  <div className="history-content">
                    <h3>{entry.name}</h3>
                    <time>{entry.date}</time>
                    {entry.note && <p>{entry.note}</p>}
                  </div>

                  <button
                    className="delete-button"
                    type="button"
                    onClick={() => deleteMood(entry.id)}
                    aria-label={`Delete ${entry.name} mood entry`}
                    title="Delete entry"
                  >
                    🗑️
                  </button>
                </article>
              ))}
            </div>

            <button
              type="button"
              className="clear-button"
              onClick={clearHistory}
            >
              Clear All History
            </button>
          </>
        )}
      </section>

      <footer>
        <p>Made with 💗 for your peace of mind.</p>
        <p>Your feelings are valid, always.</p>
      </footer>
    </main>
  );
}

export default App;