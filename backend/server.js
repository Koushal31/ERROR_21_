const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../frontend')));

const users = {};
const sessions = {};
const projects = {};

function authMiddleware(req, res, next) {
  const sessionId = req.cookies.sessionId;
  if (!sessionId || !sessions[sessionId]) {
    console.log('Unauthorized access attempt');
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.user = sessions[sessionId];
  next();
}

app.post('/api/signup', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
  if (users[username]) return res.status(400).json({ error: 'Username exists' });
  users[username] = { username, password };
  res.json({ message: 'User created' });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users[username];
  if (!user || user.password !== password) return res.status(400).json({ error: 'Invalid username or password' });
  const sessionId = uuidv4();
  sessions[sessionId] = user;
  res.cookie('sessionId', sessionId, { httpOnly: true, sameSite: 'lax' });
  res.json({ message: 'Logged in' });
});

app.post('/api/logout', authMiddleware, (req, res) => {
  const sessionId = req.cookies.sessionId;
  delete sessions[sessionId];
  res.clearCookie('sessionId');
  res.json({ message: 'Logged out' });
});

app.post('/api/projects', authMiddleware, (req, res) => {
  const { title, description, fundingGoal } = req.body;
  if (!title || !description || !fundingGoal) return res.status(400).json({ error: 'Title, description and fundingGoal required' });
  const projectId = uuidv4();
  projects[projectId] = {
    id: projectId,
    creator: req.user.username,
    title,
    description,
    fundingGoal: Number(fundingGoal),
    fundsRaised: 0,
    donors: []
  };
  res.json({ message: 'Project created', projectId });
});

app.get('/api/projects', (req, res) => {
  res.json(Object.values(projects));
});

app.get('/api/projects/:id', (req, res) => {
  const project = projects[req.params.id];
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json(project);
});

app.post('/api/projects/:id/donate', authMiddleware, (req, res) => {
  const project = projects[req.params.id];
  if (!project) return res.status(404).json({ error: 'Project not found' });
  const { amount } = req.body;
  const donAmount = Number(amount);
  if (!donAmount || donAmount <= 0) return res.status(400).json({ error: 'Invalid donation amount' });
  project.fundsRaised += donAmount;
  project.donors.push({ username: req.user.username, amount: donAmount });
  res.json({ message: 'Donation successful', fundsRaised: project.fundsRaised });
});

app.get('/api/me', authMiddleware, (req, res) => {
  const username = req.user.username;
  const userProjects = Object.values(projects).filter(p => p.creator === username);
  const userDonations = [];
  for (const p of Object.values(projects)) {
    if(p.donors){
      for (const d of p.donors) {
        if(d.username === username) userDonations.push({ projectTitle: p.title, amount: d.amount });
      }
    }
  }
  res.json({ username, projects: userProjects, donations: userDonations });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
