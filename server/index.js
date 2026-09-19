import express from 'express';
import cors from 'cors';
import crypto from 'node:crypto';
import { getDb, hashPassword, verifyPassword, ensureDataDir } from './db.js';

const app = express();
const PORT = 3001;
const db = getDb();

ensureDataDir();

const seedVouchers = [
  {
    id: 'v-1',
    nome: 'Voucher Aniversário',
    tipo: 'Comum',
    valor: 150,
    data_emitida: '2026-09-18',
    data_vencimento: '2026-10-20',
    status: 'ativo',
  },
  {
    id: 'v-2',
    nome: 'Desconto de Boas-vindas',
    tipo: 'Evento',
    valor: 80,
    data_emitida: '2026-09-01',
    data_vencimento: '2026-09-25',
    status: 'ativo',
  },
  {
    id: 'v-3',
    nome: 'Cliente VIP',
    tipo: 'Serviço',
    valor: 320,
    data_emitida: '2026-08-10',
    data_vencimento: '2026-09-15',
    status: 'resgatado',
  },
  {
    id: 'v-4',
    nome: 'Promoção de encerramento',
    tipo: 'Comum',
    valor: 200,
    data_emitida: '2026-07-01',
    data_vencimento: '2026-07-20',
    status: 'cancelado',
  },
];

const seedIfEmpty = () => {
  const count = db.prepare('SELECT COUNT(*) AS total FROM vouchers').get().total;
  if (count === 0) {
    const insert = db.prepare(`
      INSERT INTO vouchers (id, nome, tipo, valor, data_emitida, data_vencimento, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    for (const voucher of seedVouchers) {
      insert.run(voucher.id, voucher.nome, voucher.tipo, voucher.valor, voucher.data_emitida, voucher.data_vencimento, voucher.status);
    }
  }
};

seedIfEmpty();

app.use(cors());
app.use(express.json());

const generateToken = () => crypto.randomBytes(24).toString('hex');

const toPublicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const toVoucher = (row) => ({
  id: row.id,
  nome: row.nome,
  tipo: row.tipo,
  valor: Number(row.valor),
  data_emitida: row.data_emitida,
  data_vencimento: row.data_vencimento,
  status: row.status,
});

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const user = db.prepare('SELECT * FROM users WHERE token = ?').get(token);
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
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail);

  if (existing) {
    return res.status(409).json({ message: 'User already exists' });
  }

  const { hash, salt } = hashPassword(String(password));
  const userId = crypto.randomUUID();
  const token = generateToken();

  db.prepare(`
    INSERT INTO users (id, name, email, password_hash, password_salt, role, token)
    VALUES (?, ?, ?, ?, ?, 'admin', ?)
  `).run(userId, String(name).trim(), normalizedEmail, hash, salt, token);

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);

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
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(normalizedEmail);

  if (!user || !verifyPassword(String(password), user.password_hash, user.password_salt)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken();
  db.prepare('UPDATE users SET token = ? WHERE id = ?').run(token, user.id);

  return res.json({
    token,
    user: toPublicUser(user),
  });
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  res.json({ user: toPublicUser(req.user) });
});

app.post('/api/auth/logout', authMiddleware, (req, res) => {
  db.prepare('UPDATE users SET token = NULL WHERE id = ?').run(req.user.id);
  return res.json({ ok: true });
});

app.get('/api/vouchers', authMiddleware, (req, res) => {
  const vouchers = db.prepare('SELECT * FROM vouchers ORDER BY created_at DESC').all();
  res.json({ vouchers: vouchers.map(toVoucher) });
});

app.post('/api/vouchers', authMiddleware, (req, res) => {
  const payload = req.body || {};
  const id = `voucher-${Date.now()}`;
  const voucher = {
    id,
    nome: payload.nome || 'Novo Voucher',
    tipo: payload.tipo || 'Comum',
    valor: Number(payload.valor || 0),
    data_emitida: payload.data_emitida || new Date().toISOString().slice(0, 10),
    data_vencimento: payload.data_vencimento || new Date().toISOString().slice(0, 10),
    status: 'ativo',
  };

  db.prepare(`
    INSERT INTO vouchers (id, nome, tipo, valor, data_emitida, data_vencimento, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(voucher.id, voucher.nome, voucher.tipo, voucher.valor, voucher.data_emitida, voucher.data_vencimento, voucher.status);

  res.status(201).json({ voucher });
});

app.patch('/api/vouchers/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const existing = db.prepare('SELECT * FROM vouchers WHERE id = ?').get(id);

  if (!existing) {
    return res.status(404).json({ message: 'Voucher not found' });
  }

  const next = { ...existing, ...req.body };
  db.prepare(`
    UPDATE vouchers
    SET nome = ?, tipo = ?, valor = ?, data_emitida = ?, data_vencimento = ?, status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(next.nome, next.tipo, Number(next.valor), next.data_emitida, next.data_vencimento, next.status, id);

  const voucher = db.prepare('SELECT * FROM vouchers WHERE id = ?').get(id);
  return res.json({ voucher: toVoucher(voucher) });
});

app.delete('/api/vouchers/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const existing = db.prepare('SELECT * FROM vouchers WHERE id = ?').get(id);

  if (!existing) {
    return res.status(404).json({ message: 'Voucher not found' });
  }

  db.prepare('DELETE FROM vouchers WHERE id = ?').run(id);
  return res.json({ deleted: true, id });
});

app.listen(PORT, () => {
  console.log(`Voucher Rest API running on http://localhost:${PORT}`);
});
