import express from 'express';
import cors from 'cors';
import crypto from 'node:crypto';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const users = new Map();

const generateToken = () => crypto.randomBytes(24).toString('hex');

const toPublicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const user = [...users.values()].find((entry) => entry.token === token);
  if (!user) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  req.user = user;
  next();
};

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  if (users.has(normalizedEmail)) {
    return res.status(409).json({ message: 'User already exists' });
  }

  const user = {
    id: crypto.randomUUID(),
    name: String(name).trim(),
    email: normalizedEmail,
    password: String(password),
    role: 'admin',
  };

  const token = generateToken();
  users.set(normalizedEmail, { ...user, token });

  return res.status(201).json({
    token,
    user: toPublicUser(user),
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const user = users.get(normalizedEmail);

  if (!user || user.password !== String(password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken();
  user.token = token;

  return res.json({
    token,
    user: toPublicUser(user),
  });
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  res.json({ user: toPublicUser(req.user) });
});

app.post('/api/auth/logout', authMiddleware, (req, res) => {
  const email = req.user.email;
  const existing = users.get(email);
  if (existing) {
    existing.token = null;
  }

  return res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Voucher Rest API running on http://localhost:${PORT}`);
});
