const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cookieParser());

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// In-memory databases (for hackathon prototype only)
const users = {};
const sessions = {};
const projects = {};

// Middleware to check session/authentication
function authMiddleware(req, res, next) {
  const sessionId = req.cookies.sessionId;
  if (!sessionId || !sessions[sessionId]) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.user = sessions[sessionId];
  next();
}

// Signup route
app.post('/api/signup', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
  if (users[username]) return res.status(400).json({ error: 'Username exists' });
  users[username] = { username, password };
  res.json({ message: 'User created' });
});

// Login route
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users[username];
  if (!user || user.password !== password) {
    return res.status(400).json({ error: 'Invalid username or password' });
  }
  const sessionId = uuidv4();
  sessions[sessionId] = user;
  res.cookie('sessionId', sessionId, { httpOnly: true });
  res.json({ message: 'Logged in' });
});

// Logout route
app.post('/api/logout', authMiddleware, (req, res) => {
  const sessionId = req.cookies.sessionId;
  delete sessions[sessionId];
  res.clearCookie('sessionId');
  res.json({ message: 'Logged out' });
});

// Submit film project (authenticated)
app.post('/api/projects', authMiddleware, (req, res) => {
  const { title, description, fundingGoal } = req.body;
  if (!title || !description || !fundingGoal) {
    return res.status(400).json({ error: 'Title, description and fundingGoal required' });
  }
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

// List all projects (public)
app.get('/api/projects', (req, res) => {
  res.json(Object.values(projects));
});

// Get single project details (public)
app.get('/api/projects/:id', (req, res) => {
  const project = projects[req.params.id];
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json(project);
});

// Donate to a project (authenticated)
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
