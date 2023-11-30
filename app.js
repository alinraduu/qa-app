const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

// In-memory storage for questions
let questions = [];

app.get('/questions', (req, res) => {
  res.json(questions);
});

app.post('/submit', (req, res) => {
  const questionText = req.body.question;
  const question = { text: questionText, answered: false };
  questions.push(question);
  res.send('Question submitted!');
});

app.put('/markAnswered/:id', (req, res) => {
  const questionId = req.params.id;
  questions[questionId].answered = true;
  res.send('Question marked as answered!');
});

app.post('/export', (req, res) => {
  const exportData = questions.filter(question => question.answered).map(question => question.text);
  const exportText = exportData.join('\n');

  fs.writeFile('exported_questions.txt', exportText, (err) => {
    if (err) {
      console.error('Error exporting questions:', err);
      res.status(500).send('Error exporting questions');
    } else {
      res.download('exported_questions.txt');
    }
  });
});

// New endpoint for user registration check
app.get('/checkRegistration', (req, res) => {
  const username = req.query.username;
  const isRegistered = Boolean(username && username.trim() !== '');
  res.json({ isRegistered });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
