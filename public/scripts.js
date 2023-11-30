document.addEventListener('DOMContentLoaded', () => {
  checkUserRegistration();
});

function submitQuestion() {
  const question = document.getElementById('question').value;

  if (question.trim() !== '') {
    fetch('/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    })
    .then(response => response.text())
    .then(() => {
      loadQuestions();
      document.getElementById('question').value = '';
    })
    .catch(error => {
      console.error('Error submitting question:', error);
    });
  }
}

function loadQuestions() {
  const qnaContainer = document.getElementById('qnaContainer');
  qnaContainer.innerHTML = '';

  fetch('/questions')
    .then(response => response.json())
    .then(questions => {
      questions.forEach((q, index) => {
        const questionElement = document.createElement('div');
        questionElement.textContent = `Q: ${q.text}`;

        if (q.answered) {
          questionElement.classList.add('answered');
        } else {
          const answerButton = document.createElement('button');
          answerButton.textContent = 'Mark as Answered';
          answerButton.addEventListener('click', () => markAsAnswered(index));
          questionElement.appendChild(answerButton);
        }

        qnaContainer.appendChild(questionElement);
      });
    })
    .catch(error => {
      console.error('Error loading questions:', error);
    });
}

function markAsAnswered(index) {
  fetch(`/markAnswered/${index}`, {
    method: 'PUT',
  })
  .then(response => response.text())
  .then(() => {
    loadQuestions();
  })
  .catch(error => {
    console.error('Error marking question as answered:', error);
  });
}

function exportQuestions() {
  fetch('/export', {
    method: 'POST',
  })
  .then(response => {
    if (response.ok) {
      return response.blob();
    } else {
      console.error('Export failed:', response.statusText);
    }
  })
  .then(blob => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'exported_questions.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  })
  .catch(error => {
    console.error('Error exporting questions:', error);
  });
}

// User registration functions
function registerUser() {
  const username = document.getElementById('username').value;

  if (username.trim() !== '') {
    localStorage.setItem('username', username);
    document.getElementById('registrationForm').style.display = 'none';
    document.getElementById('qnaForm').style.display = 'block';
    loadQuestions();
  }
}

function checkUserRegistration() {
  const username = localStorage.getItem('username');
  if (username) {
    document.getElementById('registrationForm').style.display = 'none';
    document.getElementById('qnaForm').style.display = 'block';
    loadQuestions();
  } else {
    fetch(`/checkRegistration?username=${username}`)
      .then(response => response.json())
      .then(data => {
        if (data.isRegistered) {
          document.getElementById('registrationForm').style.display = 'none';
          document.getElementById('qnaForm').style.display = 'block';
          loadQuestions();
        }
      })
      .catch(error => {
        console.error('Error checking user registration:', error);
      });
  }
}
