import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/home.css';

function LiveScore() {
  const [scores, setScores] = useState([]);
  const [sport, setSport] = useState('cricket');

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await axios.get(`https://5491b775-be59-4e18-9b88-488fde3a90ba-00-191uhpbmd3ymd.pike.replit.dev/api/scores?sport=${sport}`);
        setScores(response.data);
      } catch (error) {
        toast.error('Error fetching live scores');
        console.error('Error fetching scores:', error);
      }
    };
    fetchScores();
  }, [sport]);

  return (
    <div className="home">
      <h1>लाइव स्कोर</h1>
      <div className="filters">
        <select value={sport} onChange={(e) => setSport(e.target.value)}>
          <option value="cricket">क्रिकेट</option>
          <option value="football">फुटबॉल</option>
        </select>
      </div>
      <div className="scores-grid">
        {scores.length > 0 ? (
          scores.map(score => (
            <div key={score.idEvent} className="score-card">
              <h3>{score.strEvent}</h3>
              <p>स्कोर: {score.intHomeScore || 'N/A'} - {score.intAwayScore || 'N/A'}</p>
              <p>स्थिति: {score.strStatus || 'Live'}</p>
              <p>तारीख: {new Date(score.dateEvent).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <p>कोई लाइव स्कोर उपलब्ध नहीं है।</p>
        )}
      </div>
    </div>
  );
}

export default LiveScore;