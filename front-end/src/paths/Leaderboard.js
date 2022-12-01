import { useState, useEffect } from 'react';
import axios from 'axios';
import Score from './Score.js';
const SCORES_API_ENDPOINT = "/citybuilder/scores";

function Leaderboard() {
  const [scores, setScores] = useState([]);
  
  const fetchScores = async () => {
    try {
      const response = await axios.get(SCORES_API_ENDPOINT);
      setScores(response.data);
    } catch (error) {
      console.log("Error retrieving scores: " + error);
    }
  }
  
  useEffect(() => {
    // fetchScores();
    setScores(
      [
      {name: "Gotham", score: 100},
      {name: "Chatham", score: 200}
      ]
    )
    console.log(scores)
  }, []);
  
  return (
    <div className="scores-list">
      {scores.map(score => (
        <Score key={score.name} game={score} />
      ))}
    </div>
  );
}

export default Leaderboard;
