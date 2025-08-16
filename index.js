const express = require('express');

const app = express();
const PORT = 6969;

app.use(express.json());

const DAIRY = {};
const EMAILS = new Set();

app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;

  if (EMAILS.has(email)) {
    return res.status(400).json({ error: `${email} already exists.` });
  }

  const token = `${Date.now()}`;

  DAIRY[token] = { name, email, password };
  EMAILS.add(email);

  return res.json({ status: `success`, token })
});

app.post('/me', (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Missing token' });
  }

  if (!(token in DAIRY)) {
    return res.status(400).json({ error: 'Invalid token' });
  }

  const entry = DAIRY[token];
  return res.json({ data: entry });
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

