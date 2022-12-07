import { useState, useEffect } from 'react';
import axios from 'axios';
import Score from './Score.js';
const SCORES_API_ENDPOINT = "/citybuilder/scores";

function Leaderboard() {
  const [scores, setScores] = useState([]);
  
  const fetchScores = async () => {
    try {
      const response = await axios.get(SCORES_API_ENDPOINT);
      setScores(response.data.sort((a, b) => b.score - a.score));
    } catch (error) {
      console.log("Error retrieving scores: " + error);
    }
  }
  
  useEffect(() => {
    fetchScores();
    // setScores(
    //   [
    //   {name: "Gotham", score: 100},
    //   {name: "Chatham", score: 200}
    //   ]
    // )
    console.log(scores);
  }, []);
  
  return (
      <div className="leaderboard-page">
        <h2>Best scores</h2>
        <div className="scores-list">
          {scores.map(score => (
            <Score key={score.name} game={score} />
          ))}
        </div>
        <footer>
        <p>Site made by Zach Hacking and Alyssa Rogers <a
            href="https://github.com/javaroc/City-Builder">repository</a></p>
        </footer>
      </div>
  );
}

export default Leaderboard;
