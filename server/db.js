import { DatabaseSync } from 'node:sqlite';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const DB_PATH = path.resolve(process.cwd(), 'server', 'data.sqlite');

export const createDb = (dbPath = DB_PATH) => {
  const db = new DatabaseSync(dbPath);

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      password_salt TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      token TEXT
    );

    CREATE TABLE IF NOT EXISTS vouchers (
      id TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      tipo TEXT NOT NULL,
      valor REAL NOT NULL DEFAULT 0,
      data_emitida TEXT NOT NULL,
      data_vencimento TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'ativo',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  return db;
};

export const hashPassword = (password, salt = crypto.randomBytes(16).toString('hex')) => {
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return { hash, salt };
};

export const verifyPassword = (password, storedHash, salt) => {
  const { hash } = hashPassword(password, salt);
  return hash === storedHash;
};

export const ensureDataDir = () => {
  const targetDir = path.dirname(DB_PATH);
  fs.mkdirSync(targetDir, { recursive: true });
};

export const getDb = () => createDb();
