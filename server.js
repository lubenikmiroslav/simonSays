const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

let leaderboard = [];

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/save-score', (req, res) => {
    const { nickname, score } = req.body;
    leaderboard.push({ nickname, score });
    leaderboard = leaderboard.sort((a, b) => b.score - a.score).slice(0, 10); // Top 10 scores
    res.json(leaderboard);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
